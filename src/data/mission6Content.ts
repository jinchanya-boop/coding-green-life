export type InstrKind = 'set' | 'forEachStart' | 'forEachEnd' | 'if' | 'else' | 'endIf' | 'increment' | 'output'

export interface BlockDef {
  id: string
  kind: InstrKind
  label: string
  varName?: string
  value?: number
  itemVar?: string
  condField?: string
  condValue?: string
  incrementBy?: number
  outputVar?: string
}

export interface DatasetItem {
  [key: string]: string
}

export interface CodeChallenge {
  id: string
  title: string
  storySetup: string
  datasetLabel: string
  dataset: DatasetItem[]
  expectedOutput: number
  pool: BlockDef[]
}

export const CODE_CHALLENGES: CodeChallenge[] = [
  {
    id: 'cb1',
    title: 'นับขวดพลาสติกรีไซเคิล',
    storySetup: 'เขียนโปรแกรมนับว่าในถังขยะมีขวดพลาสติกรีไซเคิลกี่ชิ้น จากรายการขยะที่เก็บมาได้วันนี้',
    datasetLabel: 'wasteList',
    dataset: [
      { type: 'recycle' },
      { type: 'organic' },
      { type: 'recycle' },
      { type: 'general' },
      { type: 'recycle' },
      { type: 'hazardous' },
    ],
    expectedOutput: 3,
    pool: [
      { id: 'b1', kind: 'set', label: 'SET count = 0', varName: 'count', value: 0 },
      { id: 'b2', kind: 'forEachStart', label: 'FOR EACH item IN wasteList', itemVar: 'item' },
      { id: 'b3', kind: 'if', label: 'IF item.type == "recycle" THEN', condField: 'type', condValue: 'recycle' },
      { id: 'b4', kind: 'increment', label: 'count = count + 1', varName: 'count', incrementBy: 1 },
      { id: 'b5', kind: 'endIf', label: 'END IF' },
      { id: 'b6', kind: 'forEachEnd', label: 'END FOR' },
      { id: 'b7', kind: 'output', label: 'OUTPUT count', outputVar: 'count' },
      // distractors
      { id: 'b8', kind: 'set', label: 'SET count = 1', varName: 'count', value: 1 },
      { id: 'b9', kind: 'increment', label: 'count = count + 0', varName: 'count', incrementBy: 0 },
    ],
  },
  {
    id: 'cb2',
    title: 'นับขยะอันตราย',
    storySetup: 'เขียนโปรแกรมนับจำนวนขยะอันตรายในรายการ เพื่อแจ้งเตือนให้แยกทิ้งพิเศษ',
    datasetLabel: 'wasteList',
    dataset: [
      { type: 'hazardous' },
      { type: 'organic' },
      { type: 'recycle' },
      { type: 'hazardous' },
      { type: 'general' },
      { type: 'hazardous' },
      { type: 'hazardous' },
    ],
    expectedOutput: 4,
    pool: [
      { id: 'c1', kind: 'set', label: 'SET dangerCount = 0', varName: 'dangerCount', value: 0 },
      { id: 'c2', kind: 'forEachStart', label: 'FOR EACH item IN wasteList', itemVar: 'item' },
      { id: 'c3', kind: 'if', label: 'IF item.type == "hazardous" THEN', condField: 'type', condValue: 'hazardous' },
      { id: 'c4', kind: 'increment', label: 'dangerCount = dangerCount + 1', varName: 'dangerCount', incrementBy: 1 },
      { id: 'c5', kind: 'endIf', label: 'END IF' },
      { id: 'c6', kind: 'forEachEnd', label: 'END FOR' },
      { id: 'c7', kind: 'output', label: 'OUTPUT dangerCount', outputVar: 'dangerCount' },
      // distractors
      { id: 'c8', kind: 'if', label: 'IF item.type == "recycle" THEN', condField: 'type', condValue: 'recycle' },
      { id: 'c9', kind: 'set', label: 'SET dangerCount = 1', varName: 'dangerCount', value: 1 },
    ],
  },
]

export interface RunResult {
  output: number | null
  trace: string[]
  error?: string
}

export function runProgram(blocks: BlockDef[], dataset: DatasetItem[]): RunResult {
  const vars: Record<string, number> = {}
  const trace: string[] = []
  const matchEnd: Record<number, number> = {}
  const stack: number[] = []

  for (let i = 0; i < blocks.length; i++) {
    const k = blocks[i].kind
    if (k === 'forEachStart' || k === 'if') stack.push(i)
    if (k === 'forEachEnd') {
      const start = stack.pop()
      if (start === undefined || blocks[start].kind !== 'forEachStart') {
        return { output: null, trace, error: 'พบ END FOR ที่ไม่มี FOR EACH คู่กัน' }
      }
      matchEnd[start] = i
      matchEnd[i] = start
    }
    if (k === 'endIf') {
      const start = stack.pop()
      if (start === undefined || blocks[start].kind !== 'if') {
        return { output: null, trace, error: 'พบ END IF ที่ไม่มี IF คู่กัน' }
      }
      matchEnd[start] = i
      matchEnd[i] = start
    }
  }
  if (stack.length > 0) {
    return { output: null, trace, error: 'มีบล็อกที่เปิดไว้แต่ไม่ได้ปิด (ขาด END FOR หรือ END IF)' }
  }

  let finalOutput: number | null = null

  const execRange = (lo: number, hi: number, item: DatasetItem | null) => {
    let i = lo
    while (i <= hi) {
      const b = blocks[i]
      switch (b.kind) {
        case 'set':
          vars[b.varName!] = b.value!
          trace.push(`SET ${b.varName} = ${b.value}`)
          i++
          break
        case 'increment':
          vars[b.varName!] = (vars[b.varName!] ?? 0) + b.incrementBy!
          trace.push(`${b.varName} = ${b.varName} + ${b.incrementBy}  →  ${vars[b.varName!]}`)
          i++
          break
        case 'output':
          finalOutput = vars[b.outputVar!] ?? null
          trace.push(`OUTPUT ${b.outputVar}  →  ${finalOutput}`)
          i++
          break
        case 'forEachStart': {
          const end = matchEnd[i]
          trace.push(`FOR EACH item IN wasteList: เริ่มวนซ้ำ ${dataset.length} รอบ`)
          for (const d of dataset) {
            execRange(i + 1, end - 1, d)
          }
          i = end + 1
          break
        }
        case 'if': {
          const end = matchEnd[i]
          let elseIdx = -1
          let depth = 0
          for (let j = i + 1; j < end; j++) {
            if (blocks[j].kind === 'if') depth++
            if (blocks[j].kind === 'endIf') depth--
            if (blocks[j].kind === 'else' && depth === 0) {
              elseIdx = j
              break
            }
          }
          const condTrue = !!item && item[b.condField!] === b.condValue
          if (condTrue) {
            execRange(i + 1, elseIdx === -1 ? end - 1 : elseIdx - 1, item)
          } else if (elseIdx !== -1) {
            execRange(elseIdx + 1, end - 1, item)
          }
          i = end + 1
          break
        }
        default:
          i++
      }
    }
  }

  execRange(0, blocks.length - 1, null)
  return { output: finalOutput, trace }
}

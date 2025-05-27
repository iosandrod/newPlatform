import { immerable, produce } from 'immer'

export class Node {
  [immerable] = true
  id: string
  type: string
  name?: string
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
  visible: boolean
  locked: boolean

  constructor(id: string, type: string, props = {}, position = { x: 0, y: 0 }, size = { width: 100, height: 50 }) {
    this.id = id
    this.type = type
    this.props = props
    this.position = position
    this.size = size
    this.visible = true
    this.locked = false
  }

  setPosition(x: number, y: number) {
    return produce(this, draft => {
      draft.position = { x, y }
    })
  }

  resize(width: number, height: number) {
    return produce(this, draft => {
      draft.size = { width, height }
    })
  }
}

export class Group {
  [immerable] = true
  id: string
  type: 'group'
  name: string
  children: (Node | Group)[]
  locked: boolean
  visible: boolean

  constructor(id: string, name: string, children: (Node | Group)[] = []) {
    this.id = id
    this.type = 'group'
    this.name = name
    this.children = children
    this.locked = false
    this.visible = true
  }

  addChild(child: Node | Group) {
    return produce(this, draft => {
      draft.children.push(child)
    })
  }

  removeChild(childId: string) {
    return produce(this, draft => {
      draft.children = draft.children.filter(child => child.id !== childId)
    })
  }
}

export class Design {
  [immerable] = true
  rootNodes: (Node | Group)[]
  history: (Node | Group)[][]
  future: (Node | Group)[][]

  constructor(rootNodes: (Node | Group)[] = []) {
    this.rootNodes = rootNodes
    this.history = []
    this.future = []
  }

  applyChange(mutator: (draft: Design) => void): Design {
    const updated = produce(this, mutator)
    return produce(updated, draft => {
      draft.history.push(this.rootNodes)
      draft.future = []
    })
  }

  undo(): Design {
    if (this.history.length === 0) return this
    const previous = this.history[this.history.length - 1]
    return produce(this, draft => {
      draft.future.unshift(draft.rootNodes)
      draft.rootNodes = previous
      draft.history.pop()
    })
  }

  redo(): Design {
    if (this.future.length === 0) return this
    const next = this.future[0]
    return produce(this, draft => {
      draft.history.push(draft.rootNodes)
      draft.rootNodes = next
      draft.future.shift()
    })
  }
} 

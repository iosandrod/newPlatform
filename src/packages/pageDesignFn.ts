import { PageDesign } from './pageDesign'
import { PageDesignItem } from './pageItem'

const createId = (type, design) => {
  let id = design.uuid()
  let key = `${type}_${id}`
  return { id, key }
}
const createTable = (config) => {}
export const createDefaultTemplate = (design: PageDesign, config) => {
  let mainTable = config.mainTable //
  let obj = {
    layout: {
      pc: [
        {
          type: 'inline',
          columns: ['2Hz_88s0BVOVr9HoOoI3a'],
          style: {},
          ...createId('inline', design),
        },
        {
          type: 'inline',
          ...createId('inline', design), //
          columns: [
            {
              type: 'tabs',
              label: '标签页',
              icon: 'label',
              ...createId('tabs', design),
              columns: [
                {
                  ...createId('tabsCol', design), //
                  type: 'tabsCol',
                  label: 'Tab 1',
                  list: [
                    {
                      type: 'inline',
                      columns: ['qOOKKQf7tIQHpmEsDVZQm'],
                      style: {},
                      ...createId('inline', design),
                    },
                  ],
                  style: {},
                  options: {},
                },
              ],
              options: {
                type: '',
                tabPosition: 'top',
                align: 'top',
                hidden: false,
                defaultValue: '8--mKpheTje2pZiy9wxlA',
              },
              style: {
                width: '100%',
                height: '376px',
              },
              key: 'tas_ClTBS39cRJcNKeqYDLi84',
            },
          ],
          style: {},
        },
      ],
      mobile: [
        {
          type: 'inline',
          columns: ['2Hz_88s0BVOVr9HoOoI3a'],
        },
        {
          type: 'inline',
          columns: ['qOOKKQf7tIQHpmEsDVZQm'],
        },
        {
          type: 'inline',
          columns: ['ajK_arECmlSyIvbDObxC6'],
        },
        {
          type: 'inline',
          columns: ['vxz7_UfuMb3f3uIqy36vg'],
        },
      ],
    },
    data: {},
    config: {
      isSync: true,
      pc: {
        size: 'default',
        labelPosition: 'left',
        completeButton: {
          text: '提交',
          color: '',
          backgroundColor: '',
        },
      },
      mobile: {
        labelPosition: 'left',
        completeButton: {
          text: '提交',
          color: '',
          backgroundColor: '',
        },
      },
    },
    fields: [
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_2Hz_88s0BVOVr9HoOoI3a',
        id: '2Hz_88s0BVOVr9HoOoI3a',
        options: {
          clearable: true,
          isShowWordLimit: false,
          renderType: 1,
          disabled: false,
          showPassword: false,
          defaultValue: '',
          placeholder: '',
          labelWidth: 100,
          isShowLabel: true,
          required: false,
          min: null,
          max: null,
        },
        style: {
          width: {
            pc: '100%',
            mobile: '100%',
          },
          height: '320px',
        },
      },
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_qOOKKQf7tIQHpmEsDVZQm',
        id: 'qOOKKQf7tIQHpmEsDVZQm',
        options: {
          clearable: true,
          isShowWordLimit: false,
          renderType: 1,
          disabled: false,
          showPassword: false,
          defaultValue: '',
          placeholder: '',
          labelWidth: 100,
          isShowLabel: true,
          required: false,
          min: null,
          max: null,
        },
        style: {
          width: {
            pc: '100%',
            mobile: '100%',
          },
        },
      },
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_ajK_arECmlSyIvbDObxC6',
        id: 'ajK_arECmlSyIvbDObxC6',
        options: {
          clearable: true,
          isShowWordLimit: false,
          renderType: 1,
          disabled: false,
          showPassword: false,
          defaultValue: '',
          placeholder: '',
          labelWidth: 100,
          isShowLabel: true,
          required: false,
          min: null,
          max: null,
        },
        style: {
          width: {
            pc: '100%',
            mobile: '100%',
          },
        },
      },
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_vxz7_UfuMb3f3uIqy36vg',
        id: 'vxz7_UfuMb3f3uIqy36vg',
        options: {
          clearable: true,
          isShowWordLimit: false,
          renderType: 1,
          disabled: false,
          showPassword: false,
          defaultValue: '',
          placeholder: '',
          labelWidth: 100,
          isShowLabel: true,
          required: false,
          min: null,
          max: null,
        },
        style: {
          width: {
            pc: '100%',
            mobile: '100%',
          },
        },
      },
    ],
    logic: {},
  }
  if (1 == 1) {
    return null
  }
  return obj
}



type AnyNode = Record<string, any>;

interface TreeNode extends AnyNode {
  id: string;
  pid?: string | null;        // 指向父级 id
  children?: TreeNode[];      // 子节点集合
}

/**
 * 将布局数组转换为带 pid/children 的树结构
 * 规则：
 * - 子节点通过 pid 关联父级 id
 * - 父级节点通过 children 存子节点
 * - 同时兼容 item.columns 与 item.list 两类子节点容器
 * - 字符串子项会生成占位叶子：{ id: <string>, type:'ref' }
 */
export function buildPidTree(input: AnyNode[]): TreeNode[] {
  const flat: TreeNode[] = [];
  const visit = (item: any, parentId: string | null) => {
    if (typeof item === 'string') {
      // 字符串引用（占位叶子）
      flat.push({ id: item, type: 'ref', pid: parentId });
      return;
    }
    const { columns, list, ...rest } = item || {};
    const node: TreeNode = { ...rest, pid: parentId };
    flat.push(node);

    const children: any[] = [];
    if (Array.isArray(columns)) children.push(...columns);
    if (Array.isArray(list)) children.push(...list);
    for (const child of children) visit(child, node.id);
  };

  for (const top of input) visit(top, null);

  // 链接 children
  const map = new Map<string, TreeNode>();
  for (const n of flat) {
    n.children = [];
    map.set(n.id, n);
  }
  for (const n of flat) {
    if (n.pid != null) {
      const p = map.get(n.pid);
      if (p) p.children!.push(n);
    }
  }
  // 根：pid 为 null
  return flat.filter(n => n.pid == null);
}

// ===== 示例调用 =====
const data = /* 贴你的数组 */ [];
const tree = buildPidTree(data);

// tree 即为：根数组（每个根有 children，所有子节点也带 pid）
console.log(tree);

// 如果你也需要“纯平铺 + pid”：
const flattenWithPid = (rootTree: TreeNode[]) => {
  const out: TreeNode[] = [];
  const dfs = (nodes: TreeNode[]) => {
    for (const n of nodes) {
      const { children, ...rest } = n;
      out.push(rest as TreeNode);
      if (children?.length) dfs(children);
    }
  };
  dfs(rootTree);
  return out;
};

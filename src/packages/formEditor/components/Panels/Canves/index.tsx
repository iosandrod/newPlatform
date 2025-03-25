import { defineComponent, inject, ref, resolveComponent, unref } from 'vue';
import LayoutDragGable from '@ER/formEditor/components/Layout/DragGable';
import LayoutInlineLayout from '@ER/formEditor/components/Layout/InlineLayout';
import CompleteButton from '@ER/formEditor/components/CompleteButton';
import hooks from '@ER/hooks/index';
import _ from 'lodash';
import { ElMain } from 'element-plus';
import { Form } from '@ER/form';
import formBarBread from '@/bread/formBarBread';
export default defineComponent({
  name: 'Canves',
  inheritAttrs: false,
  customOptions: {},
  components: {
    formBarBread,
  },
  setup() {
    const ER: any = inject('Everright');
    const ns = hooks.useNamespace('Canves');
    const target = hooks.useTarget();
    const { state, setSelection, isEditModel, isPc } = target;
    // console.log(target,'testTarget')//
    const handleClick = (e) => {
      setSelection('root');
    };
    let formIns: Form = inject('formIns');
    const setFormRef = (ref: any) => {
      ER.form = ref;
      if (ref == null) {
        formIns.unregisterRef('form');
      } else {
        //
        formIns.registerRef('form', ref);
      }
    };
    const renderContent = () => {
      const TagComponent: any = resolveComponent(unref(isPc) ? 'el-form' : 'van-form');
      const typeProps = hooks.useProps(state, state, unref(isPc), true);
      const Layout = (
        <LayoutDragGable
          data-layout-type={'root'}
          class={[unref(isEditModel) && ns.e('wrap')]}
          data={state.store}
          parent={state.store}
          isRoot
        ></LayoutDragGable>
      );
      let bar = null
      if (formIns.getShowFormBar()) {
        bar = <div>
          <formBarBread></formBarBread>
        </div>
      }
      return (
        <div>
          {bar}
          <TagComponent
            ref={setFormRef}
            onClick={unref(isEditModel) && handleClick}
            {...typeProps.value}
            model={formIns.data}
            rules={formIns.getValidateRules()}
          >
            {Layout}
          </TagComponent>
          {!unref(isEditModel) && !_.isEmpty(state.config) && ER.props.isShowCompleteButton && (
            <CompleteButton handle={ER.form} />
          )}
        </div>
      );
    };
    return () => {
      return (
        <ElMain
          class={[
            ns.b(),
            isEditModel.value && ns.e('editModel'),
            !unref(isPc) && ns.e('mobile'),
            !unref(isPc) && ns.e(`mobile_layoutType${ER.props.layoutType}`),
            // ER.props.layoutType === 1  && ns.e('layoutType1')
          ]}
        >
          {unref(isEditModel) ? (
            <div class={[ns.e('container')]}>
              <el-scrollbar ref={ER.canvesScrollRef}>
                <div class={[ns.e('subject')]}>{renderContent()}</div>
              </el-scrollbar>
            </div>
          ) : (
            renderContent()
          )}
        </ElMain>
      );
    };
  },
});

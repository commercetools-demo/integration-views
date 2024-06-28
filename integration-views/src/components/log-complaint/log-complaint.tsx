import { FC } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import MultilineTextField from '@commercetools-uikit/multiline-text-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { InfoDialog } from '@commercetools-frontend/application-components';
import { useFormik } from 'formik';
import { useOrderUpdater } from '../order/updateOrder';
import { TOrder, TOrderUpdateAction } from '../../types/generated/ctp';

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  order: TOrder;
};

type FormProps = { complaint: string };

export const LogComplaint: FC<Props> = ({ isModalOpen, closeModal, order }) => {
  const { execute } = useOrderUpdater();
  console.log(order);
  const formik = useFormik<FormProps>({
    initialValues: { complaint: '' },

    onSubmit: (values: FormProps) => {
      const actions: Array<TOrderUpdateAction> = [];
      if (
        !order.custom ||
        !order.custom.type ||
        order.custom.type.key !== 'order-extensions'
      ) {
        actions.push({ setCustomType: { typeKey: 'order-extensions' } });
      }
      const item = order.custom?.customFieldsRaw?.find(
        (item) => item.name === 'order-complaints'
      );
      let items: Array<string> = [];
      if (item) {
        // @ts-ignore
        items = items.concat(item.value);
      }
      items.unshift(values.complaint);
      actions.push({
        setCustomField: {
          name: 'order-complaints',
          value: JSON.stringify(items),
        },
      });
      execute({
        id: order.id,
        version: order.version,
        actions: actions,
      });
      console.log(values);
    },
  });
  return (
    <InfoDialog
      isOpen={isModalOpen}
      onClose={closeModal}
      title={'Log Complaint'}
    >
      <Spacings.Stack scale={'m'}>
        <MultilineTextField
          name={'complaint'}
          title="Complaint"
          value={formik.values.complaint}
          onChange={formik.handleChange}
          placeholder={'Add the complaint here'}
        />
        <Spacings.Inline justifyContent={'flex-end'}>
          <PrimaryButton label={'Save'} onClick={formik.submitForm} />
        </Spacings.Inline>
      </Spacings.Stack>
    </InfoDialog>
  );
};

export default LogComplaint;

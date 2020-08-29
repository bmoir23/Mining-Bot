import React, { useRef , useState  } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';

import { Account } from '@/services/wallet/data'
import { addAccount , queryAccount } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: Account) => {
  const hide = message.loading('Adding');
  try {
    await addAccount({ ...fields });
    hide();
    message.success('Adding success!');
    return true;
  } catch (error) {
    hide();
    message.error('Adding fail!');
    return false;
  }
};

/**
 * 添加节点
 * @param fields
 */
const handleQuery = async () => {
  try {
    
    const resp = await queryAccount();
    console.log(resp)
    message.success('Getting Account Success!');
    return resp
  } catch (error) {
    message.error('Getting Account fail!');
    return {'data':''};
  }
};

//

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const accountColomns: ProColumns<Account>[] = [
    {
      title: 'Address',
      dataIndex: 'address'
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      hideInForm: true
    },
  ];

  return (
    <PageContainer>
        <ProTable<Account>
          headerTitle="Account Info"
          actionRef={actionRef}
          rowKey="tradingPair"
          columns={accountColomns}
          search={false}
          pagination={false}
          request={(params, sorter, filter) => queryAccount({ ...params, sorter, filter })}
          toolBarRender={() => [
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> Add
            </Button>,
          ]}
        />
    
        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable<Account, Account>
            onSubmit={async (value) => {
              const success = await handleAdd(value);
              console.log(success)
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="key"
            type="form"
            columns={accountColomns}
            rowSelection={{}}
          />
        </CreateForm>
    </PageContainer >
  );
};

export default TableList;
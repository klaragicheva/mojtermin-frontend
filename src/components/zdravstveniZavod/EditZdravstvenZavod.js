import {Form, Input, Modal, notification} from 'antd';
import axios from "axios";

const close = () => {
    console.log('Notification was closed. Either the close button was clicked or duration time elapsed.',);
}

function EditZdravstvenZavod(props) {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const onSubmit = (values) => {
        axios.put('http://localhost:8080/zdravstvenZavod/' + props.obj._id, values)
            .then(res => {
                form.resetFields();
                props.closeModal();
                console.log(res.data);
                props.onUpdate(res.data);
                notification.success({
                    message: 'Spremeni podatke',
                    description: 'Uspesno ste spremenili podatke!',
                    placement: 'bottomRight',
                    duration: 3,
                });
            }).catch(err => {
            notification.error({
                message: 'Spremeni podatke',
                description: 'Zgodila se napaka pri spremenitev podatke!',
                placement: 'bottomRight',
                duration: 3,
            });
            console.log(err);
        });
    }

    return (<div>
            <Modal
                title="Spremeni podatke"
                open={props.zz}
                onCancel={() => {
                    props.closeModal();
                }}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            console.log(values);
                            onSubmit(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form layout="vertical" form={form} initialValues={props.obj}>
                    <Form.Item label="Naziv" name="naziv" rules={[{required: false, message: 'Vnesite naziv!'}]}>
                        <Input placeholder="Naziv" type="text"/>
                    </Form.Item>
                    <Form.Item label="Lokacija" name="lokacija"
                               rules={[{required: false, message: 'Vnesite lokacijo!'}]}>
                        <Input placeholder="Lokacija" type="text"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>);
}

export default EditZdravstvenZavod;
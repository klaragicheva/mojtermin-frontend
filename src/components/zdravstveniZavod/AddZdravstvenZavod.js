import {Form, Input, Modal, notification} from "antd";
import axios from "axios";
import {db, db2} from "../dexie/dexiedb";
import {useEffect} from "react";

function AddZdravstvenZavod(props) {

    const [form] = Form.useForm();

    const onSubmit = (values) => {
        axios.post('http://localhost:8080/zdravstvenZavod', values)
            .then(res => {
                form.resetFields();
                props.closeModal();
                console.log(res.data);
                props.onUpdate(res.data);
                notification.success({
                    message: 'Dodaj podatke',
                    description: 'Uspesno ste dodali nov zdravstven zavod!',
                    placement: 'bottomRight',
                    duration: 3,
                });
            }).catch(err => {

            let naziv = values.naziv;
            let lokacija = values.lokacija;
            try {
                const id = db.zdravstvenZavodData.add({
                    naziv, lokacija,
                });
                const id2 = db2.zdravstvenZavodDataAddNew.add({
                    naziv, lokacija,
                });
                notification.info({
                    message: 'Dodaj podatke v Dexie - OFFLINE',
                    description: 'Podatke ste dodali v local storage!',
                    placement: 'bottomRight',
                    duration: 3,
                });
                console.log(`Added ${naziv} and ${lokacija}: ${id}`);
            } catch (error) {
                console.log(`Failed to add ${naziv} and ${lokacija}: ${error}`);
            }
            notification.error({
                message: 'Dodaj podatke',
                description: 'Zgodila se napaka pri dodajanje podatke!',
                placement: 'bottomRight',
                duration: 3,
            });
            form.resetFields();
            props.closeModal();
            console.log(err);
        });
    }

    return (<div>
            <Modal
                title="Dodaj nove podatke"
                open={props.open}
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
                <Form layout="vertical" form={form}>
                    <Form.Item label="Naziv" name="naziv" rules={[{required: true, message: 'Vnesite naziv!'}]}>
                        <Input placeholder="Naziv" type="text"/>
                    </Form.Item>
                    <Form.Item label="Lokacija" name="lokacija"
                               rules={[{required: true, message: 'Vnesite lokacijo!'}]}>
                        <Input placeholder="Lokacija" type="text"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>);
}

export default AddZdravstvenZavod;
import React, {useEffect, useState} from 'react';
import axios from "axios";

//import {remote} from '@electron/remote';

import {Button, Input, notification, Popconfirm, Table} from "antd";
import {DatabaseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined} from '@ant-design/icons';

import EditZdravstvenZavod from "./EditZdravstvenZavod";
import AddZdravstvenZavod from "./AddZdravstvenZavod";
import {db, db2} from "../dexie/dexiedb";

//const {BrowserWindow, dialog} = remote;

/*const electron = window.require('electron');
const remote = electron.remote
const {BrowserWindow} = remote*/

function ZdravstvenZavod() {

    const columns = [{
        title: 'Naziv',
        dataIndex: 'naziv',
        key: 'naziv',
        editable: true,
        sorter: (a, b) => b.naziv.length - a.naziv.length,
        sortDirections: ['ascend'],
    }, {
        title: 'Lokacija', dataIndex: 'lokacija', key: 'lokacija', filters: [{
            text: 'Maribor', value: 'Maribor',
        }, {
            text: 'Ljubljana', value: 'Ljubljana',
        }, {
            text: 'Celje', value: 'Celje',
        }, {
            text: 'Murska Sobota', value: 'Murska Sobota',
        },], onFilter: (value, record) => record.lokacija.indexOf(value) === 0
    }, {
        title: 'Spremeni', data: 'spremeni', key: 'spremeni', render: (k, record) => {
            return (<div>
                <Button default onClick={() => {
                    console.log(k);
                    handleEdit(k);
                }}><EditOutlined/> Spremeni</Button>
            </div>);
        }

    }, {
        title: 'Izbriši', data: 'izbrisi', key: 'izbrisi', render: (k, record) => {
            return (<div>
                <Popconfirm title={`Ali zelis zbrisat ${record.naziv}?`} okText="DA" cancelText="NE"
                            onConfirm={() => handleDelete(k._id)}>
                    <Button type="dashed" danger><DeleteOutlined/> Zbrisi</Button>
                </Popconfirm>
            </div>);
        }
    }];

    const [zdravstveniZavod, setZdravstveniZavod] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedObject, setSelectedObject] = useState({});
    const [searchString, setSearchString] = useState('');

    const handleDelete = (key) => {
        console.log(key);
        axios.delete('http://localhost:8080/zdravstvenZavod/' + key).then(res => {
            setZdravstveniZavod(res.data);
        }).catch(err => {
            console.log(err);
        });
    };
    const handleEdit = (fullobject) => {
        // open model
        console.log(fullobject._id);
        console.log(fullobject.naziv);
        console.log(fullobject.lokacija);
        setOpenEditModal(true);
        setSelectedObject(fullobject);
    }
    const handleTableUpdate = (newData) => {
        setZdravstveniZavod(newData);
    }
    const openAddZdravstvenZavod = () => {
        setOpenAddModal(true);
    }

    const postNewestDataFromDexie = () => {
        console.log('POST - online');
        db2.zdravstvenZavodDataAddNew.toArray().then((results) => {
            try {
                console.log(results);
                results.map(m => axios.post('http://localhost:8080/zdravstvenZavod', {
                    naziv: m.naziv, lokacija: m.lokacija
                }).then(res => {
                    setZdravstveniZavod(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log(err);
                    // post sam ako sme online
                }));
            } catch (error) {
                console.log(`Failed to add ${results.data}: ${error}`);
            }
            console.log(results);
        });
    }

    const handleFromMongo = () => {
        // from mongo to dexie - get
        console.log("from mongo to dexie");
        db.zdravstvenZavodData.clear();
        axios.get('http://localhost:8080/zdravstvenZavod')
            .then(res => {
                console.log(res.data);
                db.zdravstvenZavodData.toArray().then((results) => {
                    try {
                        res.data.map(m => db.zdravstvenZavodData.put({
                            naziv: m.naziv, lokacija: m.lokacija
                        }))
                    } catch (error) {
                        console.log(`Failed to add ${results.data}: ${error}`);
                    }
                })
                notification.success({
                    message: 'Podatke brez spletnih povezav',
                    description: 'Uspesno ste pridobili podatke brez povezava na streznik!',
                    placement: 'bottomRight',
                    duration: 3,
                });
            }).catch(err => {
            console.log(err);
        });
    }

    /*    useEffect(() => {
           axios.get('http://localhost:8080/zdravstvenZavod')
               .then(res => {
                   console.log(res.data);
                   db.zdravstvenZavodData.toArray().then((results) => {
                       try {
                           res.data.map(m => db.zdravstvenZavodData.put({
                               naziv: m.naziv, lokacija: m.lokacija
                           }))
                       } catch (error) {
                           console.log(`Failed to add ${results.data}: ${error}`);
                       }
                       console.log(results);
                   })
               })
               .catch(err => {
                   console.log(err);
               });
        });*/

    useEffect(() => {
        axios.get('http://localhost:8080/zdravstvenZavod')
            .then(res => {
                setZdravstveniZavod(res.data);
            })
            .catch(err => {
                // Get data from Dexie if there is no connection
                db.zdravstvenZavodData.toArray().then((results) => {
                    setZdravstveniZavod(results);
                    console.log(results);
                });
                console.log(err);
            })
    }, []);
    // miliosceonds

/*    useEffect(() => {
        db2.open()
            .then(() => {
                // get the count of records in the 'friends' table
                console.log(db2.zdravstvenZavodDataAddNew.count());
                return db2.zdravstvenZavodDataAddNew.count();
            })
            .then(count => {
                console.log(`There are ${count} records in the 'friends' table.`);
            })
            .catch(error => {
                console.error(error);
            });
    });*/

    return (<div>
        {/*        <button onClick={() => {
            let win = new BrowserWindow()
            win.loadURL('https://www.electronjs.org/docs/api/remote')
        }}>
            Open BrowserWindow
        </button>
        <button onClick={() => {
            dialog.showErrorBox('Error Box', 'Fatal Error')
        }}>Show Error Box
        </button>*/}
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Input placeholder="Search" style={{width: '25%', marginBottom: 18}} allowClear
                   onChange={(val) => {
                       console.log(val.currentTarget.value);
                       setSearchString(val.currentTarget.value);
                   }}
            />
            <Button onClick={() => {
                openAddZdravstvenZavod();
            }} type="default"
                    style={{marginLeft: 10, marginBottom: 18}}>
                <PlusOutlined/> Dodaj
            </Button>
            <Button onClick={() => {
                postNewestDataFromDexie();
            }} type="default"
                    style={{marginLeft: 10, marginBottom: 18}}>
                <ReloadOutlined/> Posodobi Mongo from Dexie (online)
            </Button>
            <Button style={{marginLeft: 10, marginBottom: 18}} onClick={() => {
                handleFromMongo()
            }}><DatabaseOutlined/>From MongoDB (online)</Button>
        </div>
        <Table columns={columns}
            //dataSource={zdravstveniZavod}
               dataSource={zdravstveniZavod.filter((c) => c.naziv.toLowerCase().includes(searchString.toLowerCase()) || c.lokacija.toLowerCase().includes(searchString.toLowerCase()))}
               bordered>
        </Table>
        <AddZdravstvenZavod open={openAddModal} closeModal={() => {
            setOpenAddModal(false)
        }} onUpdate={handleTableUpdate}/>
        {openEditModal === true ? <div>
            <EditZdravstvenZavod
                zz={openEditModal}
                obj={selectedObject}
                closeModal={() => {
                    setOpenEditModal(false);
                }}
                onUpdate={handleTableUpdate}
            />
        </div> : null}
    </div>);
}

export default ZdravstvenZavod;
import {useEffect, useState} from "react";
import axios from "axios";
import ZdravstvenZavod from './components/zdravstveniZavod/ZdravstvenZavod';
import {db} from "./components/dexie/dexiedb";

import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';

import {ConfigProvider, Layout, Menu, Switch, theme} from 'antd';

import {
    LogoutOutlined,
    MedicineBoxOutlined,
    MehOutlined,
    SmileOutlined,
    SolutionOutlined,
    DatabaseOutlined,
    FileSearchOutlined
} from '@ant-design/icons';

const {Header, Content, Footer} = Layout;
const {defaultAlgorithm, darkAlgorithm} = theme;

const routes = [{
    path: '/zdravstvenZavod', component: <ZdravstvenZavod/>, title: 'Zdravstveni Zavod', icon: <MedicineBoxOutlined/>,
}, {
    path: '/specialist', component: <ZdravstvenZavod/>, title: 'Specialisti', icon: <SolutionOutlined/>,
}];

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profileData, setProfileData] = useState({});
    //const [dexieData, setDexieData] = useState([]);
    const [fromMongoToDexieData, setFromMongoToDexieData] = useState([]);

    useEffect(() => {
        window.electronAPI.getProfile().then((profile) => {
            console.log(profile);
            setProfileData(profile);
        });
    }, []);

    const handleClick = () => {
        setIsDarkMode((previousValue) => !previousValue);
    };

    const handleLogout = () => {
        window.electronAPI.logOut();
    }

    const handleFromMongo = () => {
        // from mongo to dexie - get
        console.log("from mongo to dexie");
        db.zdravstvenZavodData.clear();
        axios.get('http://localhost:8080/zdravstvenZavod')
            .then(res => {
                console.log(res.data);
                setFromMongoToDexieData(res.data);
                db.zdravstvenZavodData.toArray().then((results) => {
                    try {
                        fromMongoToDexieData?.map(m => db.zdravstvenZavodData.put({
                            naziv: m.naziv, lokacija: m.lokacija
                        }))
                        console.log(fromMongoToDexieData)
                    } catch (error) {
                        console.log(`Failed to add ${results.data}: ${error}`);
                    }
                    console.log(results);
                })
            }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div><h1>Electron app</h1></div>
/*        <ConfigProvider theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    }}>
        <div>

            <Router>
                <Layout className="layout">
                    <Header style={{paddingInline: '0px'}}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            //defaultSelectedKeys={['1']}
                        >
                            {routes.map((route) => {
                                return (<Menu.Item key={`menu${route.path}`} icon={route.icon}>
                                    <Link to={route.path}>{route.title}</Link>
                                </Menu.Item>);
                            })}
                            {/!*                            <Menu.Item key="fromMongo" icon={<DatabaseOutlined/>} onClick={() => {
                                handleFromMongo()
                            }}>From MongoDB (online)</Menu.Item>*!/}
                            <Menu.Item key="mode">
                                <Switch
                                    checkedChildren={<SmileOutlined/>}
                                    unCheckedChildren={<MehOutlined/>}
                                    size='large'
                                    defaultChecked
                                    onClick={handleClick}
                                > Change Theme to {isDarkMode ? "Light" : "Dark"} </Switch>
                            </Menu.Item>
                            <Menu.Item key="userdata">{profileData.name} {profileData.nickname}</Menu.Item>
                            <Menu.Item key="picture">
                                <img src={profileData.picture} style={{
                                    width: "35px", borderRadius: "50%", alignSelf: "center", marginTop: "15px"
                                }} alt="Profile Picture"></img>
                            </Menu.Item>
                            <Menu.Item key="odjava" icon={<LogoutOutlined/>} onClick={() => {
                                handleLogout()
                            }}>Odjava
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{padding: '30px 0px'}}>
                        {/!* <Layout className="site-layout">*!/}
                        <Content style={{margin: '10px', overflow: 'initial'}}>
                            <Routes>
                                {/!*{routes.map((route) => {
                                        return (
                                            <Route key={route.path} path={route.path} element={route.component} exact>
                                                {route.component}
                                            </Route>
                                        );
                                    })}*!/}
                                <Route path="/zdravstvenZavod" element={<ZdravstvenZavod/>}/>
                                <Route path="/specialist" element={<ZdravstvenZavod/>}/>
                                {/!*<Route path="/fromMongo"/>*!/}
                            </Routes>
                        </Content>
                        {/!* </Layout>*!/}
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Moj Termin - Klara Gicheva</Footer>
                </Layout>
            </Router>
        </div>
    </ConfigProvider>*/);
}

export default App;

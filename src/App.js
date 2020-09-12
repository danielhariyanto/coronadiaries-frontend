import React, { useState, useEffect } from 'react';
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { Row, Layout, Menu } from 'antd';
import { Link, useHistory } from "react-router-dom";
import Routes from "./Routes";
import './App.less';
import { onError } from "./libs/errorLib";

const { Header, } = Layout;

const App = () => {
    const history = useHistory();
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [menuItem, setMenuItem] = useState(isAuthenticated ? "3" : "1");
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
        }

        setIsAuthenticating(false);
    }

    useEffect(() => {
        onLoad();
    }, []);

    async function handleLogout() {
        await Auth.signOut();

        userHasAuthenticated(false);
        history.push("/login");
    }

    return (
        !isAuthenticating && <Layout style={{minHeight:"100vh"}}>
            <Header>
                <Row justify="end">
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[menuItem]}>
                        { isAuthenticated ?
                            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[menuItem]}>
                                <Menu.Item key="4" onClick={() => setMenuItem("4")}><Link to="/diaries/new">New Diary</Link></Menu.Item>
                                <Menu.Item key="1" onClick={() => {
                                    handleLogout();
                                    setMenuItem("1");
                                }}><Link to="/">Logout</Link></Menu.Item>
                            </Menu>
                            : <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[menuItem]}>
                                <Menu.Item key="1" onClick={() => setMenuItem("1")}><Link to="/login">Login</Link></Menu.Item>
                                <Menu.Item key="2" onClick={() => setMenuItem("2")}><Link to="/signup">Sign up</Link></Menu.Item>
                            </Menu>
                        }
                    </Menu>
                </Row>
            </Header>
            <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                <Routes />
            </AppContext.Provider>
        </Layout>
)};

export default App;
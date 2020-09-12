import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Form, Input, Button, Col, Row, Typography} from 'antd';
import { onError } from "../libs/errorLib";

import { useAppContext } from "../libs/contextLib";
import {useFormFields} from "../libs/hooksLib";

const { Title } = Typography;


export default function Login(){
    const { userHasAuthenticated } = useAppContext();
    const history = useHistory();

    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    function validateForm(email, password) {
        return email.length > 0 && password.length > 0;
    }

    async function handleSubmit(values) {

        setIsLoading(true);

        try {
            await Auth.signIn(values.email, values.password);
            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    let { email, password } = fields;
    return (
        <Row justify="center" align="middle" className="full-page">
            <Col span={12}>
                <Title>Login</Title>
                <Form
                    name="basic"
                    onFinish={handleSubmit}
                    size="large"
                    layout="vertical"
                    onValuesChange={(form) => {
                        if(form.email) {
                            handleFieldChange("email", form.email)
                        }
                        if(form.password) {
                            handleFieldChange("password", form.password)
                        }
                    }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        value={email}
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        value={password}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button block loading={isLoading} type="primary" htmlType="submit" disabled={!validateForm(email, password)}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}
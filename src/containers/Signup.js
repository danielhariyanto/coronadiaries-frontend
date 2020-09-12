import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {useAppContext} from "../libs/contextLib";
import {useFormFields} from "../libs/hooksLib";
import {Button, Col, Form, Input, Row, Typography} from "antd";
import {Auth} from "@aws-amplify/auth";
import {onError} from "../libs/errorLib";

const { Title } = Typography;

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });

    const history = useHistory();
    const [newUser, setNewUser] = useState(null);
    const {userHasAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    function validateForm()
    {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(values) {

        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit() {
        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);

            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <Row justify="center" align="middle" className="fullPage">
                <Col span={12}>
                    <Title>Verify Signup</Title>
                    <Form
                        name="verify"
                        onFinish={handleSubmit}
                        size="large"
                        layout="vertical"
                        onFinish={handleConfirmationSubmit}
                        onValuesChange={(form) => {
                            if(form.confirmationCode){
                                handleFieldChange("confirmationCode", form.confirmationCode);
                            }
                        }}
                    >
                        <Form.Item
                            label="Confirmation Code"
                            name="confirmationCode"
                            value={fields.confirmationCode}
                            rules={[{ required: true, message: 'Please input your confirmation code!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button block loading={isLoading} type="primary" htmlType="submit" disabled={!validateConfirmationForm()}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }

    function renderForm() {
        const { email, password } = fields;
        return (
            <Row justify="center" align="middle" className="full-page">
                <Col span={12}>
                    <Title>Sign Up</Title>
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
                            if(form.confirmPassword){
                                handleFieldChange("confirmPassword", form.confirmPassword);
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

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            value={password}
                            rules={[{ required: true, message: 'Please confirm your password!' }]}
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

    return (
        <div>
            {newUser === null ? renderForm() : renderConfirmationForm() }
        </div>
    );

}
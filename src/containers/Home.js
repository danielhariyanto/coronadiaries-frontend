import React from "react";
import { Row, Col, Typography, Button } from 'antd';
import "./Home.css";
import {useHistory} from "react-router-dom";
import { BookOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Home() {
    const history = useHistory();
    return (
        <Row justify="center" align="middle" className="full-page" style={{flexDirection: "column"}}>
            <Col>
                <Title>Corona Diaries</Title>
            </Col>
            <Col>
                <p>A way to check in with your friends.</p>
            </Col>
            <Col>
                <Button type="primary" block size="large" icon={<BookOutlined />} onClick={() => {
                    history.push("/diaries/new");
                }}>New Diary Entry</Button>
            </Col>
        </Row>
    );
}
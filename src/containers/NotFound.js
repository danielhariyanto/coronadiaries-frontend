import React from 'react';
import { Row, Result, Button } from "antd";
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Row justify="center" align="middle">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button component={Link} to="/">Back Home</Button>}
            />
        </Row>
    );
}
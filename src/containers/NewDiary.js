import MicRecorder from "mic-recorder-to-mp3";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import React from "react";
import { Row, Col, Button, Typography } from "antd";
import {
    PauseCircleOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import {onError} from "../libs/errorLib";

const { Title } = Typography;

const lame = require('lamejs');
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class AudioRecorder extends React.Component {
    constructor(props) {
        super(props);
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        this.state = {
            isRecording: false,
            isPaused: false,
            blobURL: "",
            isBlocked: false
        };
    }

    startRecording = () => {
        if (this.state.isBlocked) {
            console.log("Please give permission for the microphone to record audio.");
        } else {
            Mp3Recorder.start()
                .then(() => {
                    this.setState({ isRecording: true });
                })
                .catch(e => console.error(e));
        }
    };

    stopRecording = async () => {
        this.setState({ isRecording: false });
        Mp3Recorder.stop()
            .getMp3()
            .then(async ([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                this.setState({
                    blobURL: blobURL,
                    isRecording: false
                });
                const file = new File([blob], "babySharkTest.mp3", {
                    type: "audio/mpeg"
                });
                const fileName = await s3Upload(file);
                try {
                    await API.post("diaries", "/diaries", {
                        body: {
                            title: "Baby Shark",
                            fileName,
                        }
                    });
                } catch (e) {
                    onError(e);
                }
            })
            .catch(e => console.log(e));
    };

    checkPermissionForAudio = () => {
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                // First get ahold of the legacy getUserMedia, if present
                var getUserMedia =
                    // navigator.getUserMedia ||
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(
                        new Error("getUserMedia is not implemented in this browser")
                    );
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                this.setState({ isBlocked: false });
            })
            .catch(err => {
                this.setState({ isBlocked: true });
                console.log("Please give permission for the microphone to record audio.");
                console.log(err.name + ": " + err.message);
            });
    };

    componentDidMount() {
        this.checkPermissionForAudio();
    }

    render() {
        const { isRecording } = this.state;
        return (
            <Row align="middle" justify="center" className="full-page">
                <div>
                    <Title>How are you doing today?</Title>
                    { !isRecording ? <Col span={24}>
                        <Row justify="center">
                            <Button
                                block
                                icon={<PlayCircleOutlined /> }
                                size="large"
                                onClick={this.startRecording}
                                type="primary"
                            >
                                Record
                            </Button>
                        </Row>
                    </Col> :
                    <Col span={24}>
                        <Row justify="center">
                            <Button
                                block
                                icon={<PauseCircleOutlined />}
                                size="large"
                                onClick={this.stopRecording}
                                type="danger"
                            >
                                Stop
                            </Button>
                        </Row>
                    </Col> }

                    <Col span={24}>
                        <Row justify="center">
                            <audio
                                ref="audioSource"
                                controls="controls"
                                src={this.state.blobURL || ""}
                            />
                        </Row>
                    </Col>
                </div>
            </Row>
        );
    }
}

export default AudioRecorder;

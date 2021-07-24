import { Button, Input, message, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import openDirectory from "utils/openDirectory";
const styles = require("./index.scss");
const { ipcRenderer } = require("electron");
interface PictureState {
    sourcePath: string;
    targetPath: string;
    resultInfo: any;
}
export default class Picture extends React.Component<{}, PictureState> {
    state: PictureState = {
        sourcePath: "",
        targetPath: "",
        resultInfo: []
    };
    componentDidMount() {
        ipcRenderer.on("selectedItem", (_e, { id, path }) => {
            if (!path) {
                return;
            }
            this.setState({ [id]: path } as any);
        });
        ipcRenderer.on("picture-compression-end", (_e, res) => {
            const { result, msg, value } = res;
            if (result) {
                message.success(msg);
                this.setState({ resultInfo: value })
            } else {
                message.error(msg);
            }
        });
    }
    stateChange = <T extends keyof PictureState>(type: T, value: PictureState[T]) => {
        this.setState({ [type]: value } as Pick<PictureState, T>);
    };

    startCopy = () => {
        const { sourcePath, targetPath } = this.state;
        if (!sourcePath || !targetPath) {
            message.error("请先选择相应的目录");
            return;
        }
        if (sourcePath === targetPath) {
            message.error("目标目录不能与源目录相同");
            return;
        }
        ipcRenderer.send("picture-compression", { sourcePath, targetPath });
        message.success("正在压缩图片~，请稍候");
    };
    reset = () => {
        this.setState({
            sourcePath: "",
            targetPath: "",
            resultInfo: []
        })
    }
    render() {
        const { sourcePath, targetPath, resultInfo } = this.state;
        const columns: ColumnProps<any>[] = [
            {
                title: "压缩图片",
                dataIndex: "imgName",
            },
            {
                title: "原始大小",
                dataIndex: "OriginalSize",
            },
            {
                title: "压缩大小",
                dataIndex: "CompressedSize"
            },
            {
                title: "优化比例",
                dataIndex: "OptimizationRatio"
            }
        ]
        return (
            <div className={styles.conter}>
                <div className={styles.topConter}>
                    <div className={styles.leftImg} />
                    <img src="./images/bamboo.png" alt="" />

                    <Button onClick={() => openDirectory("sourcePath")}>打开源目录</Button>{sourcePath}
                    <br />
                    <Button onClick={() => openDirectory("targetPath")}>打开目标目录</Button>{targetPath}
                    <br />
                    <Button type="primary" onClick={this.startCopy}>开始转换</Button>
                    <Button type="primary" onClick={this.reset}>重新选择</Button>
                </div>
                <Table
                    bordered
                    dataSource={resultInfo}
                    pagination={false}
                    columns={columns}
                    rowKey={record => record}
                />
            </div>
        )
    }
}
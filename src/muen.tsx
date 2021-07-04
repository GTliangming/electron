import * as React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Menu } from "antd";

const styles = require("./index.scss");

class IMenu extends React.PureComponent<RouteComponentProps> {
	render() {
		const { location } = this.props;
		return (
			<Menu
				className={styles.menu}
				theme="dark"
				mode="inline"
				selectedKeys={[location.pathname]}
				defaultOpenKeys={["game"]}
			>
				<Menu.SubMenu key="game" title="游戏">
					<Menu.Item key="/game">
						<Link to="/game">五子棋</Link>
					</Menu.Item>
				</Menu.SubMenu>
			</Menu>
		);
	}
}

export default withRouter<RouteComponentProps, React.ComponentType<RouteComponentProps>>(IMenu);

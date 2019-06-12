// hydrates the wholeeeeee store

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as user from "../../store/user";
import * as myCourses from "../../store/myCourses";
import Spinner from "../utilities/spinner";

class Hydrate extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true
    };
  }

  async componentDidMount() {
    if (this.props.myCourses) {
      this.setState({ spinner: false });
    } else {
      const me = await this.props.loadUser();
      this.props.loadMyCourses(me);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.myCourses) {
      this.setState({ spinner: false });
    }
  }

  public render() {
    return (
      <div>
        {this.state.spinner == true && (
          <Spinner notice="...loading your course history..." />
        )}
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.user,
    ...state.myCourses
  }),
  {
    ...user.actionCreators,
    ...myCourses.actionCreators
  }
)(Hydrate);

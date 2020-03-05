import React from "react";
import { Link } from "react-router-dom";
import TextField from "../common/TextField";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/authActions";
import { Alert } from "reactstrap";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      alertVisible: false,
      alertMessage: "",
      emailToConfirm: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.openAlert = this.openAlert.bind(this);
  }

  closeAlert() {
    this.setState({
      alertVisible: false,
      alertMessage: ""
    });
  }

  openAlert(message) {
    this.setState({
      alertVisible: true,
      alertMessage: message
    });
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (!nextProps.auth.isConfirmed) {
      this.setState({
        emailToConfirm: this.state.email
      });
      this.openAlert(
        `Please confirm your email at: ${this.state.emailToConfirm}`
      );
      this.setState({
        email: "",
        username: "",
        password: "",
        password2: ""
      });
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const userData = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(userData);
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="login-page-bck LR-layout">
        <div className="modal-diolog text-center login-page">
          <div className="col-sm-8 main-section">
            <div className="modal-content">
              <div className="col-12 logo-img">
                <img alt="" src="img/logo.png" />
              </div>
              <Alert
                color="success"
                isOpen={this.state.alertVisible}
                toggle={this.closeAlert}
              >
                {this.state.alertMessage}
              </Alert>
              <form className="col-12" onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextField
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.onChange}
                    error={errors.errors && errors.errors.username}
                    iconning="fas fa-user floaty-icon"
                  />
                  <TextField
                    placeholder="Email"
                    name="email"
                    type="text"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.errors && errors.errors.email}
                    iconning="fas fa-envelope floaty-icon"
                  />
                  <TextField
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.errors && errors.errors.password}
                    iconning="fas fa-lock floaty-icon"
                  />
                  <TextField
                    placeholder="Confirm Password"
                    name="password2"
                    type="password"
                    value={this.state.password2}
                    onChange={this.onChange}
                    error={errors.errors && errors.errors.password2}
                    iconning="fas fa-lock floaty-icon"
                  />
                </div>
                <button type="submit" className="btn login-btn">
                  <i className="fas fa-user-plus"></i> Register
                </button>
                <div className="pied-de-form">
                  <div className="link-to-page-div have-an-account">
                    <Link to="/" className="link-btn">
                      <p className="link-btn-sign-in">Sign in</p>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(Register);

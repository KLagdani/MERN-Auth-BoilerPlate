import React from "react";
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
      alert: {
        alertVisible: true,
        alertMessage: "this is alert",
        emailToConfirm: ""
      }
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.openAlert = this.openAlert.bind(this);
  }

  closeAlert() {
    this.setState({
      alert: {
        alertVisible: false,
        alertMessage: ""
      }
    });
  }

  openAlert(message) {
    this.setState({
      alert: {
        alertVisible: true,
        alertMessage: message
      }
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
        alert: {
          emailToConfirm: this.state.email
        }
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
      <main className="register-page">
        <div className="register-page_cover"></div>
        <div className="register-page_content">
          <div className="row register-page_content-row">
            <div className="col-1-of-2 register-page_content-left">
              <img
                src="img/register.png"
                alt="Register"
                className="register-page_content-left_img"
              />
              <div className="u-center-text register-page_content-left_text">
                <h2 className="heading-third register-page_content-left_text-title u-margin-bottom-small">
                  Register
                </h2>
                <p className="paragraph u-center-text register-page_content-left_text-p">
                  Hello and welcome, please register :)
                </p>
              </div>
            </div>
            <div className="col-1-of-2 register-page_content-right">
              <div className="register-page_content-right_form">
                <h1 className="heading-first heading-first--main register-page_content-right_form_title u-margin-bottom-big">
                  {" "}
                  MERN Boiler Plate
                </h1>
                <h1 className="heading-first heading-first--sub">
                  Welcome to boiler plate
                </h1>
                <Alert
                  color="success"
                  isOpen={this.state.alert.alertVisible}
                  toggle={this.closeAlert}
                  className="u-margin-bottom-small"
                >
                  {this.state.alert.alertMessage}
                </Alert>

                <form
                  className="register-page_content-right_form-content form"
                  onSubmit={this.onSubmit}
                >
                  <div className="form-group">
                    <TextField
                      placeholder="Username"
                      name="username"
                      type="text"
                      value={this.state.username}
                      onChange={this.onChange}
                      error={errors.errors && errors.errors.username}
                      iconning="fas fa-user"
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
                  <button type="submit" className="form__btn">
                    <i className="fas fa-user-plus"></i> Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
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

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import loginImage from "../../assets/loginImage.jpg";
import "../../styles/login.css";
import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import { useMutation } from "@apollo/client/react";
import "../../styles/ForgetPassword.css";
import { Link } from "react-router";
import "../../App.css";
import { forgetPasswordSchema } from "../../schemas/forgetPassword";
import type {
  ForgetPasswordInput,
  ForgetPasswordResponse,
} from "../../types/forgetPassword";
import { yupResolver } from "@hookform/resolvers/yup";
import { SEND_FORGET_PASSWORD } from "../../apollo/graphql/mutations/ForgetPassword";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordInput>({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const [sendForgotPasswordOtp, { loading }] = useMutation<
    { sendForgotPasswordOtp: ForgetPasswordResponse },
    { email: string }
  >(SEND_FORGET_PASSWORD);
  const onSubmit = async (data: ForgetPasswordInput) => {
    try {
      const res = await sendForgotPasswordOtp({
        variables: { email: data.email },
      });

      const result = res.data?.sendForgotPasswordOtp;

      if (result?.success) {
        toast.success(result.message || "Mail sent successfully");
      } else {
        toast.error(result?.message || "Failed to send Mail");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Container fluid className="vw-100 vh-100 p-0 m-0 container-bg">
      <Row className="h-100 w-100 m-0">
        <Col
          md={6}
          className="d-flex flex-column overflow-hidden justify-content-center align-items-center col-bg position-relative"
        >
          <div className=" main-container">
            <div className="text-center">
              <img
                src={Logo}
                alt="Propomy Logo"
                width={"42px"}
                height={"42px"}
              />
              <h2 className="mt-2 welcome-title">Forget Password</h2>
              <p className="forget-text">
                Enter your email for the verification process,we will send you
                an email.
              </p>
            </div>
            <div className="mt-3">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-1" controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    placeholder="Enter an email address"
                    size="lg"
                    className="custom-input"
                    {...register("email")}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message as string}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="login-btn-container mt-3">
                  <Button
                    className="login-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Sending Mail..." : "Submit"}
                  </Button>
                </div>
              </Form>
            </div>

            <div className="fw-light text-center mt-3 text-16">
              Need help? Call <a href="tel:8447640583">(844) 764-0583</a> or
              email us at{" "}
              <a href="mailto:Support@Propomy.com">Support@Propomy.com</a> —
              Mon–Fri, 8AM-6PM EST
            </div>
          </div>
          {/* Footer section pinned to bottom of left column */}
          <div className="position-fixed left-0 bottom-0 px-3 pb-4 login-footer-responsive">
            <hr className="my-4" />
            <div className="fw-light text-center text-16">
              Don’t have an account?{" "}
              <Link to="/signup" className="link-blue">
                Sign up today!
              </Link>
            </div>
          </div>
        </Col>
        <Col md={6} className=" p-0 d-none d-md-block h-100">
          <img src={loginImage} alt="Login" className="login-img" />
        </Col>
      </Row>
    </Container>
  );
};

export default ForgetPassword;

/* eslint-disable react/prop-types */
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Icon, Input, Button } from 'antd';
import fetch from 'isomorphic-fetch';
import { checkStatus, parseJSON } from '../../../utils/fetch';
import {
  validateAccountNameMin,
  validateAccountNameMax,
  validateAccountNameSegmentStart,
  validateAccountNameSegmentAlphaNumeric,
  validateAccountNameSegmentDash,
  validateAccountNameSegmentEnd,
  validateAccountNameSegmentMin,
} from '../../../utils/validator';

class Username extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      username: '',
    };
  }

  validateUsername = (rule, value, callback) => {
    if (value) {
      if (window.usernameTimeout) {
        window.clearTimeout(window.usernameTimeout);
      }
      window.usernameTimeout = setTimeout(() => {
        fetch(`/api/check_username?username=${value}&email=${this.props.email}`)
          .then(checkStatus)
          .then(parseJSON)
          .then((data) => {
            if (data.error) {
              callback(this.props.intl.formatMessage({ id: data.error }));
            } else {
              this.setState({ username: value });
              callback();
            }
          });
      }, 500);
    } else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.submitting) return;
    this.setState({ submitting: true });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      } else {
        this.setState({ submitting: false });
      }
    });
  };

  render() {
    const { form: {
      getFieldDecorator,
      getFieldError,
      isFieldValidating,
      getFieldValue,
    }, intl,
    username } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className="signup-form">
        <Form.Item
          hasFeedback
        >
          {getFieldDecorator('username', {
            validateFirst: true,
            rules: [
              { required: true, message: intl.formatMessage({ id: 'error_username_required' }) },
              { validator: validateAccountNameMin, message: intl.formatMessage({ id: 'error_validation_account_min' }) },
              { validator: validateAccountNameMax, message: intl.formatMessage({ id: 'error_validation_account_max' }) },
              { validator: validateAccountNameSegmentStart, message: intl.formatMessage({ id: 'error_validation_account_segment_start' }) },
              { validator: validateAccountNameSegmentAlphaNumeric, message: intl.formatMessage({ id: 'error_validation_account_segment_alpha' }) },
              { validator: validateAccountNameSegmentDash, message: intl.formatMessage({ id: 'error_validation_account_segment_dash' }) },
              { validator: validateAccountNameSegmentEnd, message: intl.formatMessage({ id: 'error_validation_account_segment_end' }) },
              { validator: validateAccountNameSegmentMin, message: intl.formatMessage({ id: 'error_validation_account_segment_min' }) },
              { validator: this.validateUsername },
            ],
            initialValue: username,
          })(
            <Input
              prefix={<Icon type="user" />}
              placeholder={intl.formatMessage({ id: 'username' })}
            />,
          )}
        </Form.Item>
        {
          getFieldValue('username') &&
          !getFieldError('username') &&
          !isFieldValidating('username') &&
          <p>
            <FormattedMessage
              id="username_available"
              values={{ username: <strong>{getFieldValue('username')}</strong> }}
            />
          </p>
        }
        <div className="form-actions">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={this.state.submitting}><FormattedMessage id="continue" /></Button>
          </Form.Item>
        </div>
      </Form>
    );
  }
}

export default Form.create()(injectIntl(Username));

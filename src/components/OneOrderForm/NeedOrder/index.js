import React from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Icon,
  message,
  Select,
  Spin,
  DatePicker
} from "antd";
import _ from "lodash";
import "../index.less";
import styles from "../index.module.css";

const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;

// 申请人和部门readOnly，且不能为空
// 基本信息字段
const USER_NAME = "userName"; // 申告人
const MOBILE_PHONE = "mobilePhone"; // 手机号码
const TELEPHONE = "telephone"; // 固定电话
const DEPARTMENT = "department"; // 部门
const SYSTEM = "system"; // 需求系统
const NEED_TYPE = "needType"; // 需求类型
const NEED_SUB_TYPE = "needSubType"; // 需求子类型
const NEED_MODULE = "needModule"; // 需求模块
const NEED_SUB_MODULE = "needSubModule"; // 需求子模块
const LEVEL = "level"; // 优先级
const FINISH_TIME = "finishTime"; // 预计完成时间

const needTypeList = [
  {value: "咨询", text: "咨询"},
  {value: "数据处理", text: "数据处理"},
  {value: "权限变更", text: "权限变更"},
  {value: "系统缺陷", text: "系统缺陷"},
  {value: "功能需求", text: "功能需求"},
]

class NeedOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      activeTip: "data", // tab类型显示基本数据
      fetching: false, // 是否正在搜索需求系统
      systemList: [
        { value: "1", text: "IT宝" },
        { value: "2", text: "统一平台" }
      ], // 系统列表
      needTypeList: needTypeList,
      needSubTypeList: [],
      needModuleList: [],
      needSubModuleList: [],
      levelList: [
        {text:"一般", value:"1"},
        {text:"紧急", value:"2"},
      ],
      styles: {
        "form-head": "form-head",
        form: "form",
        "form-half": "form-half"
      }
    };
    this.submitForm = _.throttle(this.submitForm, 2000);
  }
  /**
   *@param value 切换到目标tab
   *
   */
  toggleTip = value => {
    this.setState({ activeTip: value });
  };

  submitForm = e => {
    e.persist();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const postObj = {
        ...values,
        [FINISH_TIME]: values[FINISH_TIME].format("YYYY-MM-DD")
      }
      console.log(postObj)
      if (!err) {
        const postObj = {
          ...values,
          [FINISH_TIME]: values[FINISH_TIME].format("YYYY-MM-DD")
        }
        console.log("Received values of form: ", values);
      }
    });
  };

  /**
   * 系统下拉框搜索
   * @param value 输入内容
   * @memberof NeedOrder
   */
  fetchSystem = value => {
    console.log("fetching user", value);
    this.setState({ systemList: [], fetching: true });
    // fetch('https://randomuser.me/api/?results=5')
    //   .then(response => response.json())
    //   .then((body) => {
    //     const data = body.results.map(user => ({
    //       text: `${user.name.first} ${user.name.last}`,
    //       value: user.login.username,
    //     }));
    //     this.setState({ data, fetching: false });
    //   });
  };

  /**
   * 需求系统发生改变时回调
   * @param value 需求系统所选的值
   * @memberof NeedOrder
   */
  handleSystemChange = value => {
    // this.props.form.setFieldValue(DEPARTMENT, value);
    this.setState({
      systemList: [],
      fetching: false
    });
  };

  /**
   * 需求类型发生改变回调
   * @param value 选择的值
   * @memberof NeedOrder
   */
  needTypeChange = value => {

  }
  /**
   * 需求子类型发生改变回调
   * @param value 选择的值
   * @memberof NeedOrder
   */
  needSubTypeChange = value => {

  }
  /**
   * 需求模块名称发生改变回调
   * @param value 选择的值
   * @memberof NeedOrder
   */
  needSubModuleChange = value => {

  }
  /**
   * 需求子模块名称发生改变回调
   * @param value 选择的值
   * @memberof NeedOrder
   */
  needSubModuleChange = value => {

  }
  
  /**
   * 普通下拉框发生改变回调，只需要改变值，不需要其他操作
   * @param value 选择的值
   * @param type 关联的字段名称
   * @memberof NeedOrder
   */
  commonSelectChange = (value, type) => {
    this.props.form.setFieldValue(type, value)
  }

  /**
   * 日期改变回调
   * @param date 日期moment
   * @param dateString 日期字符串
   * @param type 关联的字段名称
   * @memberof NeedOrder
   */
  finishTimeChange = (date, dateString, type) => {
    console.log(date, dateString)
    this.props.form.setFieldValue(type, date)
  }

  componentDidMount() {}

  render() {
    const {
      activeTip,
      styles,
      fetching,
      systemList,
      needTypeList,
      needSubTypeList,
      needModuleList,
      needSubModuleList,
      levelList
    } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    return (
      <div
        className="form-container"
        style={{ paddingRight: 30, marginBottom: 30 }}
      >
        <div className={`${styles["form-head"]}`}>
          <Row align={"middle"}>
            <Col span={10}>
              <span
                style={{
                  fontSize: 16,
                  color: "#242425",
                  fontWeight: "bolder",
                  lineHeight: "40px"
                }}
              >
                需求单
                {/* {isOrderCheck && !this.props.scrapNew
                  ? `  ID：${orderDetail.JOB_ID}`
                  : "  "} */}
              </span>
              {/* {(!this.props.isOrderCheck || this.props.scrapNew) && !isNeed && (
                <Button onClick={this.openRemarksModal}>打开备注框</Button>
              )}*/}
            </Col>
            <Col span={14} style={{ textAlign: "right" }}>
              {
                // !this.state.isFromServiceP &&
                <Button
                  className="light-white-btn"
                  onClick={this.goBackLast}
                  style={{ marginRight: 16 }}
                >
                  取消
                </Button>
              }

              <Button
                type="primary"
                className="light-blue-btn"
                onClick={this.submitForm}
                style={{ marginRight: 0 }}
              >
                提交
              </Button>
            </Col>
            {/* {isNeed && (
              <Col span={14} style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  className="light-blue-btn"
                  onClick={this.goRequireSys}
                  style={{ marginRight: 0 }}
                >
                  需求单下单
                </Button>
              </Col>
            )} */}
          </Row>
        </div>
        <div className={` ${styles["form"]}`}>
          <div style={{ width: "100%" }}>
            <Form
              ref="mutipleForm"
              className={`common-form`}
              layout="inline"
              // style={{display: 'flex'}}
              // style={{ width: "100%", height: '100%', minHeight: 634, display: "flex", minWidht:1700, paddingRight:16 }}
            >
              <div
                // style={{ width: "50%", height: "100%" }}
                className={`form-part ${styles["form-half"]}`}
                style={{ float: "left" }}
              >
                <p className="conmmon-title active-title">基础信息</p>
                <div className="form-part-content">
                  {/* 表格左边数据 */}
                  <FormItem style={{ width: 300 }} label="申告人 ">
                    {getFieldDecorator(USER_NAME, {
                      initialValue: "张三",
                      rules: [
                        {
                          required: true,
                          message: "请填写申告人姓名"
                        }
                      ]
                    })(
                      <Search
                        readOnly
                        // style={{ width: 200 }}
                        placeholder="姓名"
                        onSearch={value => console.log(value)}
                        enterButton
                      />
                    )}
                  </FormItem>

                  <div
                    style={{ paddingLeft: 80, display: "flex", width: "100%" }}
                  >
                    <div style={{ width: 250 }}>
                      <FormItem
                        // {...shortItemLayout}
                        label="手机号码"
                        // style={inputStyle}
                        style={{ display: "inline-block" }}
                      >
                        {getFieldDecorator(MOBILE_PHONE, {
                          // initialValue: editData
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: true,
                              message: "请输入正确手机号码",
                              // type:'number'，
                              pattern: /^1[34578]\d{9}$/
                            }
                          ]
                        })(
                          <Input
                            style={{ width: 150 }}
                            placeholder="手机号码"
                          />
                        )}
                      </FormItem>
                    </div>
                    <div style={{ width: 250 }}>
                      <FormItem
                        // {...shortItemLayout}
                        label="固定电话"
                        // style={inputStyle}
                        style={{ display: "inline-block" }}
                      >
                        {getFieldDecorator(TELEPHONE, {
                          // initialValue: editData
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: true,
                              message: "请输入正确固定电话",
                              pattern: /^[0-9\-]*$/
                            }
                          ]
                        })(
                          <Input
                            style={{ width: 150 }}
                            placeholder="固定电话"
                          />
                        )}
                      </FormItem>
                    </div>
                  </div>
                  <FormItem
                    // {...shortItemLayout}
                    label="用户部门"
                    // style={inputStyle}
                    // style={{ display: "inline-block" }}
                  >
                    {getFieldDecorator(DEPARTMENT, {
                      initialValue: "科腾",
                      //   ? editData.declaratorMobile
                      //   : "",
                      validateTrigger: "onBlur",
                      rules: [
                        {
                          required: true,
                          message: "请填入部门"
                        }
                      ]
                    })(
                      <Input
                        readOnly
                        // style={{ width: 150 }}
                      />
                    )}
                  </FormItem>
                  <FormItem label="需求系统" style={{ width: 300 }}>
                    {getFieldDecorator(SYSTEM, {
                      // initialValue: editData.declaratorMobile
                      //   ? editData.declaratorMobile
                      //   : "",
                      validateTrigger: "onBlur",
                      rules: [
                        {
                          required: true,
                          message: "请选填需求系统"
                        }
                      ]
                    })(
                      <Select
                        // labelInValue
                        // value={value}
                        showSearch={true}
                        placeholder="搜索..."
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                        filterOption={false}
                        onSearch={this.fetchSystem}
                        onChange={this.handleSystemChange}
                        style={{ width: "100%" }}
                      >
                        {systemList.map(d => (
                          <Option key={d.value}>{d.text}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  <Row gutter={16}>
                    <Col span={12}>
                      <FormItem label="需求类型">
                        {getFieldDecorator(NEED_TYPE, {
                          // initialValue: editData.declaratorMobile
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: true,
                              message: "请选填需求类型"
                            }
                          ]
                        })(
                          <Select onChange={this.needTypeChange}>
                            {needTypeList.map(d => (
                              <Option key={d.value}>{d.text}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="需求子类型">
                        {getFieldDecorator(NEED_SUB_TYPE, {
                          // initialValue: editData.declaratorMobile
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: false,
                              // message: "请选填需求系统"
                            }
                          ]
                        })(
                          <Select
                            onChange={this.needSubTypeChange}
                            style={{ width: "100%" }}
                          >
                            {needSubTypeList.map(d => (
                              <Option key={d.value}>{d.text}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <FormItem label="模块名称">
                        {getFieldDecorator(NEED_MODULE, {
                          // initialValue: editData.declaratorMobile
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: true,
                              message: "请选填模块名称"
                            }
                          ]
                        })(
                          <Select onChange={this.needModuleChange}>
                            {needModuleList.map(d => (
                              <Option key={d.value}>{d.text}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="需求子类型">
                        {getFieldDecorator(NEED_SUB_MODULE, {
                          // initialValue: editData.declaratorMobile
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: false,
                              // message: "请选填需求系统"
                            }
                          ]
                        })(
                          <Select
                            onChange={this.needSubModuleChange}
                            style={{ width: "100%" }}
                          >
                            {needSubModuleList.map(d => (
                              <Option key={d.value}>{d.text}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <FormItem label="优先级别">
                        {getFieldDecorator(LEVEL, {
                          initialValue: "1",
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: true,
                              message: "请选择优先级"
                            }
                          ]
                        })(
                          <Select onChange={value => this.commonSelectChange(value, LEVEL)}>
                            {levelList.map(d => (
                              <Option key={d.value}>{d.text}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="预计完成时间">
                        {getFieldDecorator(FINISH_TIME, {
                          // initialValue: editData.declaratorMobile
                          //   ? editData.declaratorMobile
                          //   : "",
                          rules: [
                            {
                              type:'object',
                              required: false,
                              // message: "请选填需求系统"
                            }
                          ]
                        })(
                          <DatePicker placeholder="选择日期" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </div>
              <div
                className={`form-part ${styles["form-half"]}`}
                style={{ float: "right" }}
              >
                <p
                  className={
                    activeTip === "data"
                      ? "active-title conmmon-title"
                      : "hide-title conmmon-title"
                  }
                  style={{ display: "inline-block" }}
                  onClick={e => this.toggleTip("data")}
                >
                  基础数据
                </p>
                <p
                  className={
                    activeTip === "file"
                      ? "active-title conmmon-title"
                      : "hide-title conmmon-title"
                  }
                  style={{ display: "inline-block" }}
                  onClick={e => this.toggleTip("file")}
                >
                  附件
                </p>
                <div style={{display: activeTip === "data" ? "block" : "none"}} className="form-part-content">
                  aaa
                </div>
                <div style={{display: activeTip === "file" ? "block" : "none"}} className="form-part-content">
                  file
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const NeedOrderForm = Form.create({ name: "need_upload" })(NeedOrder);
export default NeedOrderForm;

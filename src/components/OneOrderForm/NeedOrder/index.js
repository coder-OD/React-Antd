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
  DatePicker,
  Checkbox,
  Radio,
  Table,
  Modal,
  InputNumber
} from "antd";
import _ from "lodash";
import PropTypes from "prop-types";
import "../index.less";
import styles from "../index.module.css";

const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// 5种需求类型的值
const TYPE1 = "咨询";
const TYPE2 = "数据处理";
const TYPE3 = "权限变更";
const TYPE4 = "系统缺陷";
const TYPE5 = "功能需求";

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

// 咨询类、系统缺陷字段
const DESCRIPTION = "description"; // 描述
const ASSIGN_APPROVER = "assignApprover"; // 指定审批人
const IS_SELECT_ALL = "isSelectAll"; // 全选
const IS_COMPANY_ALL = "isCompanyAl"; // 企信推送全选

// 权限变更
const ADJUST_TYPE = "adjustType";
const USER_TYPE = "userType";
const ROOT_TYPE = "rootType";
const CHARGE_PERSON = "chargePerson";

// 数据处理
const OPERATE_TYPE = "operateType";
const REASON = "reason";
const IS_SELF_SOLVE = "selfSolve";

// 需求
const CHANGE_TYPE = "changeType";

const needTypeList = [
  { value: TYPE1, text: "咨询" },
  { value: TYPE2, text: "数据处理" },
  { value: TYPE3, text: "权限变更" },
  { value: TYPE4, text: "系统缺陷" },
  { value: TYPE5, text: "功能需求" }
];

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
      needTypeList: needTypeList, // 需求类型
      needSubTypeList: [], // 需求子类型
      needModuleList: [], // 需求模块
      needSubModuleList: [], // 需求子模块
      chargePersonList: [], // 部门主管
      operateTypeList: [], // 操作类型
      reasonList: [], // 原因
      approveModal: false, // 控制审批弹窗
      levelList: [{ text: "一般", value: "1" }, { text: "紧急", value: "2" }], // 优先级
      currentFlow: "", // 当前节点
      nextFlow: "", // 下一节点
      flowPos: "2", // 流程位置，在需求分类阶段
      rootList: [
        {
          num: "1",
          key: "1",
          name: "姓名1",
          status: "状态1",
          department: "部门1",
          root: "权限1",
          rootDescription: "描述1",
          reason: "原因1",
          phone: "操作1"
        },
        {
          num: "2",
          key: "2",
          name: "姓名2",
          status: "状态2",
          department: "部门2",
          root: "权限2",
          rootDescription: "描述2",
          reason: "原因2",
          phone: "操作2"
        }
      ],
      approverList: [], //审批人列表
      styles: {
        "form-head": "form-head",
        form: "form",
        "form-half": "form-half"
      }
    };
    this.rootColumns = [
      {
        title: "编号",
        dataIndex: "num"
      },
      {
        title: "姓名",
        dataIndex: "name"
      },
      {
        title: "用户状态",
        dataIndex: "status"
      },
      {
        title: "所在部门/班组",
        dataIndex: "department"
      },
      {
        title: "权限",
        dataIndex: "root"
      },
      {
        title: "权限描述",
        dataIndex: "rootDescription"
      },
      {
        title: "申请原因",
        dataIndex: "reason"
      },
      {
        title: "联系电话",
        dataIndex: "phone"
      }
    ];
    this.submitForm = _.throttle(this.submitForm, 2000);
  }
  /**
   *@param value 切换到目标tab
   *
   */
  toggleTip = value => {
    this.setState({ activeTip: value });
  };
  /**
   * 点击提交。根据需求类型以及流程位置分多种情况
   * @param e 事件对象
   * @param flowPos 流程位置
   * @memberof NeedOrder
   */
  submitForm = (e, flowPos) => {
    e.persist();
    const { form } = this.props;
    switch (flowPos) {
      case "1":
        // 首次提交表单
        form.validateFieldsAndScroll((err, values) => {
          const postObj = {
            ...values,
            [FINISH_TIME]: form.getFieldValue(FINISH_TIME)
              ? values[FINISH_TIME].format("YYYY-MM-DD")
              : ""
          };
          console.log(postObj);
          if (!err) {
            const postObj = {
              ...values,
              [FINISH_TIME]: form.getFieldValue(FINISH_TIME)
                ? values[FINISH_TIME].format("YYYY-MM-DD")
                : ""
            };
            console.log("Received values of form: ", values);
          }
        });
        break;
      case "2":
        // 一线修正完表单内容，二次提交
        this.setState({ approveModal: true });
    }
  };

  /**
   * 确定提交审核弹窗的函数
   *
   * @memberof NeedOrder
   */
  submitApprove = () => {
    // console.log(this.submitModalForm)
    if (this.submitModalForm.props) {
      this.submitModalForm.props.form.validateFieldsAndScroll((err, values) => {
        console.log(values);
        if (!err) {
          this.setState({ approveModal: false });
        }
      });
    }
  };

  cancelApprove = () => {
    this.setState({ approveModal: false });
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
    this.getFlowMsg(value);
  };
  /**
   * 需求子类型发生改变回调
   * @param value 选择的值
   * @memberof NeedOrder
   */
  needSubTypeChange = value => {};
  /**
   * 需求模块名称发生改变回调
   * @param value 选择的值
   * @memberof NeedOrder
   */
  needSubModuleChange = value => {};
  /**
   * 需求子模块名称发生改变回调
   * @param value 选择的值
   * @memberof NeedOrder
   */
  needSubModuleChange = value => {};

  /**
   * 勾选全选
   * @param value 选择的事件对象
   * @memberof NeedOrder
   */
  allSelectChange = e => {
    // console.log(e.target.checked)
  };

  /**
   * 勾选企信推送全选
   * @param value 选择的事件对象
   * @memberof NeedOrder
   */
  companySelectChange = e => {
    // console.log(e.target.checked)
  };

  /**
   * 普通下拉框发生改变回调，只需要改变值，不需要其他操作
   * @param value 选择的值
   * @param type 关联的字段名称
   * @memberof NeedOrder
   */
  commonSelectChange = (value, type) => {
    this.props.form.setFieldValue(type, value);
  };

  /**
   * 日期改变回调
   * @param date 日期moment
   * @param dateString 日期字符串
   * @param type 关联的字段名称
   * @memberof NeedOrder
   */
  finishTimeChange = (date, dateString, type) => {
    console.log(date, dateString);
    this.props.form.setFieldValue(type, date);
  };

  /**
   * 通过需求类型和流程位置获取流程信息
   *
   * @memberof NeedOrder
   */
  getFlowMsg = needType => {
    const { flowPos } = this.state;
    console.log(needType, flowPos);
    switch (needType + "_" + flowPos) {
      case TYPE2 + "_2":
        this.setState({ currentFlow: "需求分类", nextFlow: "预处理" });
        break;
      default:
        this.setState({ currentFlow: "***", nextFlow: "***" });
        break;
    }
  };

  componentDidMount() {
    const needType = this.props.form.getFieldValue(NEED_TYPE);
    this.getFlowMsg(needType);
  }

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
      levelList,
      approverList,
      chargePersonList,
      rootList,
      operateTypeList,
      reasonList,
      approveModal,
      currentFlow,
      nextFlow
    } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue
    } = this.props.form;
    const needType = getFieldValue(NEED_TYPE);
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
                onClick={e => this.submitForm(e, "2")}
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
                          initialValue: TYPE1,
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
                          <Select
                            placeholder="请选择"
                            onChange={this.needTypeChange}
                          >
                            {needTypeList.map(d => (
                              <Option key={d.value} value={d.value}>
                                {d.text}
                              </Option>
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
                              required: false
                              // message: "请选填需求系统"
                            }
                          ]
                        })(
                          <Select
                            placeholder="请选择"
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
                          <Select
                            placeholder="请选择"
                            onChange={this.needModuleChange}
                          >
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
                              required: false
                              // message: "请选填需求系统"
                            }
                          ]
                        })(
                          <Select
                            placeholder="请选择"
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
                          <Select
                            onChange={value =>
                              this.commonSelectChange(value, LEVEL)
                            }
                          >
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
                              type: "object",
                              required: false
                              // message: "请选填需求系统"
                            }
                          ]
                        })(<DatePicker placeholder="请选择" />)}
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
                <div
                  style={{ display: activeTip === "data" ? "block" : "none" }}
                  className="form-part-content"
                >
                  {needType === TYPE3 && (
                    <div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem label={"调整类型"}>
                            {getFieldDecorator(ADJUST_TYPE, {
                              initialValue: "1",
                              //   ? editData.declaratorMobile
                              //   : "",
                              rules: [
                                {
                                  required: true,
                                  message: "请选择调整类型"
                                }
                              ]
                            })(
                              <Radio.Group>
                                <Radio value="1">权限发放</Radio>
                                <Radio value="2">权限回收</Radio>
                              </Radio.Group>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem label={"用户类型"}>
                            {getFieldDecorator(USER_TYPE, {
                              initialValue: "1",
                              //   ? editData.declaratorMobile
                              //   : "",
                              rules: [
                                {
                                  required: true,
                                  message: "请选择用户类型"
                                }
                              ]
                            })(
                              <Radio.Group>
                                <Radio value="1">在册用户</Radio>
                                <Radio value="2">外委用户</Radio>
                              </Radio.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem label={"权限类型"}>
                            {getFieldDecorator(ROOT_TYPE, {
                              initialValue: "1",
                              //   ? editData.declaratorMobile
                              //   : "",
                              rules: [
                                {
                                  required: true,
                                  message: "请选择权限类型"
                                }
                              ]
                            })(
                              <Radio.Group>
                                <Radio value="1">长期权限</Radio>
                                <Radio value="2">临时权限</Radio>
                              </Radio.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  )}
                  {needType === TYPE2 && (
                    <div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem label="操作类型">
                            {getFieldDecorator(OPERATE_TYPE, {
                              // initialValue: editData.declaratorMobile
                              //   ? editData.declaratorMobile
                              //   : "",
                              validateTrigger: "onBlur",
                              rules: [
                                {
                                  required: true,
                                  message: "请选择操作类型"
                                }
                              ]
                            })(
                              <Select
                                placeholder="请选择"
                                // onChange={this.needModuleChange}
                              >
                                {operateTypeList.map(d => (
                                  <Option key={d.value}>{d.text}</Option>
                                ))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem label="原因">
                            {getFieldDecorator(REASON, {
                              // initialValue: editData.declaratorMobile
                              //   ? editData.declaratorMobile
                              //   : "",
                              validateTrigger: "onBlur",
                              rules: [
                                {
                                  required: true,
                                  message: "请选择原因"
                                }
                              ]
                            })(
                              <Select
                                placeholder="请选择"
                                // onChange={this.needSubModuleChange}
                                style={{ width: "100%" }}
                              >
                                {reasonList.map(d => (
                                  <Option key={d.value}>{d.text}</Option>
                                ))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem label={"可否自行处理"}>
                            {getFieldDecorator(IS_SELF_SOLVE, {
                              initialValue: "1",
                              //   ? editData.declaratorMobile
                              //   : "",
                              rules: [
                                {
                                  required: false
                                }
                              ]
                            })(
                              <Radio.Group>
                                <Radio value="1">是</Radio>
                                <Radio value="2">否</Radio>
                              </Radio.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  )}
                  {needType === TYPE5 && (
                    <div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem label={"变更类型"}>
                            {getFieldDecorator(CHANGE_TYPE, {
                              initialValue: "1",
                              //   ? editData.declaratorMobile
                              //   : "",
                              rules: [
                                {
                                  required: true,
                                  message: "请选择变更类型"
                                }
                              ]
                            })(
                              <Radio.Group>
                                <Radio value="1">增加</Radio>
                                <Radio value="2">修改</Radio>
                                <Radio value="3">删除</Radio>
                              </Radio.Group>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  )}
                  <FormItem
                    label={
                      getFieldValue(NEED_TYPE) === TYPE1
                        ? "咨询信息"
                        : "需求描述"
                    }
                  >
                    {getFieldDecorator(DESCRIPTION, {
                      // initialValue: ,
                      rules: [
                        {
                          required: true,
                          message: "请填写信息"
                        }
                      ]
                    })(<TextArea autosize={{ minRows: 3, maxRow: 6 }} />)}
                  </FormItem>
                  {(needType === TYPE2 || needType === TYPE3) && (
                    <div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem label="预选部门主管">
                            {getFieldDecorator(CHARGE_PERSON, {
                              // initialValue: editData.declaratorMobile
                              //   ? editData.declaratorMobile
                              //   : "",
                              validateTrigger: "onBlur",
                              rules: [
                                {
                                  required: true,
                                  message: "请选择部门主管"
                                }
                              ]
                            })(
                              <Select
                                placeholder="请选择"
                                onChange={this.needSubTypeChange}
                                style={{ width: "100%" }}
                              >
                                {chargePersonList.map(d => (
                                  <Option value={d.value} key={d.value}>
                                    {d.text}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Row gutter={16}>
                    <Col span={14}>
                      <FormItem label="指定审批人">
                        {getFieldDecorator(ASSIGN_APPROVER, {
                          // initialValue: editData.declaratorMobile
                          //   ? editData.declaratorMobile
                          //   : "",
                          validateTrigger: "onBlur",
                          rules: [
                            {
                              required: true,
                              message: "请选择审批人"
                            }
                          ]
                        })(
                          <Select
                            placeholder="请选择"
                            // onChange={this.needSubModuleChange}
                            style={{ width: "100%" }}
                          >
                            {approverList.map(d => (
                              <Option key={d.value}>{d.text}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <FormItem>
                        {getFieldDecorator(IS_SELECT_ALL, {
                          initialValue: false
                          //   ? editData.declaratorMobile
                          //   : "",
                        })(
                          <Checkbox onChange={this.allSelectChange}>
                            全选
                          </Checkbox>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={7}>
                      <FormItem>
                        {getFieldDecorator(IS_COMPANY_ALL, {
                          valuePropName: "checked",
                          initialValue: true
                          //   ? editData.declaratorMobile
                          //   : "",
                        })(
                          <Checkbox onChange={this.companySelectChange}>
                            企信推送全选
                          </Checkbox>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {needType === TYPE3 && (
                    <div>
                      <Row gutter={16}>
                        <Col span={24}>
                          <Button type="primary">增加权限</Button>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={24}>
                          <Table
                            columns={this.rootColumns}
                            dataSource={rootList}
                            size="small"
                            pagination={false}
                            rowClassName={"table-row"}
                          />
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
                <div
                  style={{ display: activeTip === "file" ? "block" : "none" }}
                  className="form-part-content"
                >
                  file
                </div>
              </div>
            </Form>
          </div>
        </div>
        {/* 审批弹窗内容 */}
        <Modal
          width={800}
          title={
            <div>
              <span>提交</span>
              <span style={{ fontSize: 12, color: "#7f8e98" }}>
                （提示：当前节点为《{currentFlow}》
                {<span>，下一步节点为《{nextFlow}》</span>}）
              </span>
            </div>
          }
          cancelText="取消"
          okText="确定"
          destroyOnClose={true}
          onOk={this.submitApprove}
          onCancel={this.cancelApprove}
          visible={approveModal}
        >
          <SubmitModalForm
            needType={getFieldValue(NEED_TYPE)}
            flowPos={"2"}
            approverList={approverList}
            wrappedComponentRef={form => (this.submitModalForm = form)}
          />
        </Modal>
      </div>
    );
  }
}

// 弹窗字段
const HANDLER = "handler"; // 处理人
const SUBMIT_MOBILE_PHONE = "submitMobilePhone"; // 手机号码
const SUBMIT_TELEPHONE = "submitTelephone"; // 固定电话
const SUBMIT_DEPARTMENT = "submitDepartment"; // 用户部门
const SUBMIT_FLOW = "submitFlow"; // 流程转向
const SUBMIT_APPROVER = "submitApprover"; // 审批人
const IS_SUBMIT_ALL = "isSubmitAll"; // 全选
const IS_SUBMIT_COMPANY_ALL = "isSubmitCompanyAll"; //企信全选
const SUBMIT_SUGESTION = "submitSugestion"; //处理意见
const BUSINESS_MANAGER = "bussinessManager"; //业务经理
const THIRD_LINE = "thirdLine"; //三线人员
const FINISH_DAYS = "finishDays"; //处理意见


class SubmitModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      businessManagerList: [], // 业务经理
      thirdLineList: [], // 三线人员
      styles: {
        "modal-item": "modal-item",
        "modal-item-title": "modal-item-title"
      }
    };
  }

  componentDidMount() {}

  render() {
    const { styles, businessManagerList, thirdLineList } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue
    } = this.props.form;
    return (
      <Form ref="mutipleForm" className={`common-form`} layout="inline">
        <div className={`${styles["modal-item"]}`} style={{marginBottom:30}}>
          <Row>
            <Col
              offset={10}
              span={4}
              className={`${styles["modal-item-title"]}`}
            >
              当前处理人信息
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label="处理人">
                {getFieldDecorator(HANDLER, {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: "请输入处理人"
                    }
                  ]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                // {...shortItemLayout}
                label="手机号码"
                // style={inputStyle}
                style={{ display: "inline-block" }}
              >
                {getFieldDecorator(SUBMIT_MOBILE_PHONE, {
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
                })(<Input placeholder="手机号码" />)}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                // {...shortItemLayout}
                label="固定电话"
                // style={inputStyle}
                style={{ display: "inline-block" }}
              >
                {getFieldDecorator(SUBMIT_TELEPHONE, {
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
                })(<Input placeholder="固定电话" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} style={{ paddingRight: 16 }}>
            <Col span={24}>
              <FormItem
                // {...shortItemLayout}
                label="用户部门"
              >
                {getFieldDecorator(SUBMIT_DEPARTMENT, {
                  initialValue: "editData",
                  //   ? editData.declaratorMobile
                  //   : "",
                  validateTrigger: "onBlur",
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label="流程转向">
                {getFieldDecorator(SUBMIT_FLOW, {
                  // initialValue: editData.declaratorMobile
                  //   ? editData.declaratorMobile
                  //   : "",
                  validateTrigger: "onBlur",
                  rules: [
                    {
                      required: true,
                      message: "请选择流程转向"
                    }
                  ]
                })(
                  <Select placeholder="请选择">
                    {this.props.approverList.map(d => (
                      <Option key={d.value}>{d.text}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="指定审批人">
                {getFieldDecorator(SUBMIT_APPROVER, {
                  // initialValue: editData.declaratorMobile
                  //   ? editData.declaratorMobile
                  //   : "",
                  validateTrigger: "onBlur",
                  rules: [
                    {
                      required: true,
                      message: "请选择审批人"
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择"
                    // onChange={this.needSubModuleChange}
                    style={{ width: "100%" }}
                  >
                    {this.props.approverList.map(d => (
                      <Option key={d.value}>{d.text}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator(IS_SUBMIT_ALL, {
                  initialValue: false
                  //   ? editData.declaratorMobile
                  //   : "",
                })(<Checkbox onChange={this.allSelectChange}>全选</Checkbox>)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator(IS_SUBMIT_COMPANY_ALL, {
                  valuePropName: "checked",
                  initialValue: true
                  //   ? editData.declaratorMobile
                  //   : "",
                })(
                  <Checkbox onChange={this.companySelectChange}>
                    企信推送全选
                  </Checkbox>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ paddingRight: 16 }}>
            <Col span={24}>
              <FormItem label={"处理意见"}>
                {getFieldDecorator(SUBMIT_SUGESTION, {
                  // initialValue: ,
                  rules: [
                    {
                      required: true,
                      message: "请填写处理意见"
                    }
                  ]
                })(<TextArea autosize={{ minRows: 3, maxRow: 6 }} />)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className={`${styles["modal-item"]}`}>
          <Row>
            <Col
              offset={11}
              span={2}
              className={`${styles["modal-item-title"]}`}
            >
              预处理
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="预选业务经理">
                {getFieldDecorator(BUSINESS_MANAGER, {
                  // initialValue: editData.declaratorMobile
                  //   ? editData.declaratorMobile
                  //   : "",
                  validateTrigger: "onBlur",
                  rules: [
                    {
                      required: true,
                      message: "请选择业务经理"
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择"
                    // onChange={this.needSubTypeChange}
                  >
                    {businessManagerList.map(d => (
                      <Option value={d.value} key={d.value}>
                        {d.text}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="预选三线人员">
                {getFieldDecorator(THIRD_LINE, {
                  // initialValue: editData.declaratorMobile
                  //   ? editData.declaratorMobile
                  //   : "",
                  validateTrigger: "onBlur",
                  rules: [
                    {
                      required: true,
                      message: "请选择三线人员"
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择"
                    // onChange={this.needSubTypeChange}
                  >
                    {thirdLineList.map(d => (
                      <Option value={d.value} key={d.value}>
                        {d.text}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
          <Col span={8}>
              <FormItem label="计划完成天数">
                {getFieldDecorator(FINISH_DAYS, {
                  initialValue: 1,
                  rules: [
                    {
                      required: true,
                      message: "请输入计划完成天数"
                    }
                  ]
                })( <InputNumber />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}
const SubmitModalForm = Form.create({ name: "SubmitModal" })(SubmitModal);
SubmitModalForm.propTypes = {
  needType: PropTypes.string.isRequired, // 需求类型
  flowPos: PropTypes.string.isRequired, // 流程的位置
  approverList: PropTypes.array.isRequired // 审批人
};
const NeedOrderForm = Form.create({ name: "need_upload" })(NeedOrder);
export default NeedOrderForm;

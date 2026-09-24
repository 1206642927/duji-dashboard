/* ============================================================
   安徽淮北杜集经济开发区 · 重点项目专班智慧化管理平台
   数据文件（可直接编辑，或使用管理端 admin.html 生成后覆盖本文件）
   数据来源：《杜集经济开发区管委会项目工作专班推进清单》（2026.09.22）
   ============================================================ */
window.CB_DATA = {
  meta: {
    parkName: '安徽淮北杜集经济开发区',
    title: '重点项目专班智慧化管理平台',
    subtitle: '签约 · 注册 · 备案 · 能评 · 环评 · 开工 · 纳统 · 入规 全生命周期调度',
    updateTime: '2026-09-22',
    dataSource: '杜集经济开发区管委会项目工作专班推进清单'
  },

  /* 需要协调解决的问题（自动从节点 issue 字段汇总，可在此追加全局公告） */
  notices: [
    '专班调度会：每周四、周五召开，逐项目通报进展',
    '一楼大屏数据由经济运行部统一维护，实时更新'
  ],

  projects: [
    {
      id: 'p1', seq: 1, short: '优聚锂能', tag: '锂离子电池',
      name: '日产20万只高端消费类锂离子电池制造项目',
      investor: '四川昂米新能源科技有限公司',
      company: '安徽优聚锂能科技有限公司',
      contact: '孙生', phone: '18288571506',
      pos: { x: 36, y: 28 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2024年1月26日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2024年2月1日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2024年2月27日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2024年2月27日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '环评手续', plan: '2026年3月31日', done: false, dept: '安环部', staff: '林化其 17305619253',
          note: '《报告表》已通过区环保局局长预审会，下一步报送资料到区局并进行批前公示，企业反馈环保设备暂未确定', next: '持续跟进',
          issue: '企业反馈环保设备暂未确定，环评手续推进受阻' },
        { name: '厂房装修', plan: '—', done: false, dept: '规划建设部', staff: '燕宇翔 18956162009',
          note: '隔墙、吊顶、照明、地坪漆已完成，下一步安装空调外机、净化系统和转轮除湿系统', next: '暂停施工', issue: '厂房装修暂停施工，需协调企业恢复施工' },
        { name: '设备进场、安装调试', plan: '2024年6月20日', done: true, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '计划设备2000万元，已签合同1010万元、已开发票1010万元，现场已到货520万元（全自动收放卷一体机1套、折返式挤压涂布机1套）', next: '继续跟进设备到场及后续采购计划' },
        { name: '纳统', plan: '2024年7月30日', done: true, note: '已完成', dept: '经济运行部', staff: '花雪莹 18356163180' },
        { name: '入规', plan: '2026年10月31日', done: false, dept: '经济运行部', staff: '谢逸雯 18109613023',
          note: '企业暂未投产，可作为2026年储备项目', next: '关注企业投产经营情况，跟进开票进度' },
        { name: '政策兑现', plan: '2025年1月6日', done: true, dept: '财务部', staff: '郜贺 18705610031',
          note: '2025年1月6日第一笔装修扶持资金202.23万元已打入企业账户' }
      ]
    },

    {
      id: 'p2', seq: 2, short: '鑫业铝业', tag: '铝基新材料',
      name: '巨杰新能源驱动系统配套配件项目',
      investor: '上海汇杰众科技有限公司',
      company: '安徽鑫业铝业有限公司',
      contact: '蔡平阳', phone: '13867635286',
      pos: { x: 44, y: 22 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2024年3月23日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2024年3月27日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2024年7月30日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2024年10月24日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '环评手续', plan: '2024年9月6日', done: true, note: '已完成', dept: '安环部', staff: '林化其 17305619253' },
        { name: '施工许可证', plan: '2024年10月25日', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程开工', plan: '2024年9月23日', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '厂房装修', plan: '—', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程竣工', plan: '2025年10月27日', done: true, note: '已结束，已取得房产证', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '设备进场、安装调试', plan: '2025年8月31日', done: true, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '设备合同已签订2349万元，2026年设备发票已开2273万元', next: '跟进设备到场计划、新合同签订及发票开具情况' },
        { name: '纳统', plan: '2024年12月31日', done: true, note: '已完成', dept: '经济运行部', staff: '花雪莹 18356163180' },
        { name: '入规', plan: '2026年11月30日', done: false, dept: '经济运行部', staff: '谢逸雯 18109613023',
          note: '已投产，7月开票不含税66.87万元、8月开票不含税431.76万元，预计10月底达申规条件', next: '关注企业投产经营情况，跟进开票进度' }
      ]
    },

    {
      id: 'p3', seq: 3, short: '都爱车业', tag: '电动车制造',
      name: '年产5万辆智能电动车及3万台套智能电动车配件项目（都爱车业）',
      investor: '上海汇杰众科技有限公司',
      company: '安徽鑫业铝业有限公司',
      contact: '蔡平阳', phone: '13867635286',
      pos: { x: 49, y: 32 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2024年9月30日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2024年3月27日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2025年2月8日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2025年2月8日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '环评手续', plan: '2025年8月28日', done: true, note: '已完成', dept: '安环部', staff: '林化其 17305619253' },
        { name: '施工许可证', plan: '2025年5月16日', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程开工', plan: '2025年5月16日', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '厂房装修', plan: '—', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程竣工', plan: '2025年9月30日', done: true, note: '已结束，已取得房产证', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '设备进场、安装调试', plan: '2025年10月30日', done: true, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '新设备以都爱车业一期已纳统，纳统时间2025年11月，设备合同500万元、设备发票491万元', next: '已完成' },
        { name: '纳统', plan: '2025年6月30日', done: true, note: '已完成', dept: '经济运行部', staff: '花雪莹 18356163180' },
        { name: '入规', plan: '2027年9月30日', done: false, dept: '经济运行部', staff: '谢逸雯 18109613023',
          note: '企业暂未投产，计划作为2027年新增规上', next: '关注企业投产经营情况' }
      ]
    },

    {
      id: 'p4', seq: 4, short: '嘉洲电力', tag: '电力装备',
      name: '年产500台变压器及柜体生产线项目',
      investor: '安徽华源电器设备有限公司',
      company: '安徽嘉洲电力技术有限公司',
      contact: '段百永', phone: '13905212633',
      pos: { x: 22, y: 35 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2025年8月25日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2025年9月22日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2025年11月5日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2025年11月5日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '环评手续', plan: '—', done: false, dept: '安环部', staff: '林化其 17305619253',
          note: '工艺暂未确定，确定后开展环评', next: '积极跟进' },
        { name: '工程开工', plan: '2025年12月16日', done: true, note: '已进场', dept: '规划建设部', staff: '王跃飞 18805617128' },
        { name: '工程竣工', plan: '2026年2月28日', done: false, dept: '规划建设部', staff: '王跃飞 18805617128',
          note: '钢结构进场施工，立柱中，因材料未全部到位目前暂停施工', next: '等钢结构材料到场继续安装',
          issue: '钢结构材料未全部到位，工程暂时停工' },
        { name: '设备进场、安装调试', plan: '—', done: false, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '厂房建设尚未完成，暂无设备采购计划', next: '跟进厂房施工进度及企业生产需求制定采购计划' },
        { name: '纳统', plan: '2026年3月31日', done: true, note: '已完成', dept: '经济运行部', staff: '花雪莹 18356163180' }
      ]
    },

    {
      id: 'p5', seq: 5, short: '金派克', tag: '铝合金铸件·锂电池',
      name: '年产2万吨铝合金铁合金铸件及50万组电动车锂电池项目',
      investor: '上海汇杰众科技有限公司／金派克新能源科技（淮北）有限公司',
      company: '安徽鑫业铝业有限公司',
      contact: '蔡平阳', phone: '13867635286',
      pos: { x: 31, y: 44 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2025年4月22日（补充协议）', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2024年3月27日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2025年6月23日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2026年10月30日', done: false, dept: '经济运行部', staff: '葛嘉湘 17756148871',
          note: '正在确认能评公司', next: '持续跟进' },
        { name: '环评手续', plan: '2026年9月14日', done: true, note: '已完成', dept: '安环部', staff: '林化其 17305619253' },
        { name: '用地规划许可', plan: '2025年8月22日', done: true, note: '已完成', dept: '规划建设部', staff: '李颖 18056198725' },
        { name: '工程规划许可', plan: '2025年8月22日', done: true, note: '已完成', dept: '规划建设部', staff: '李颖 18056198725' },
        { name: '施工许可证', plan: '2025年8月27日', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程开工', plan: '2025年8月28日', done: true, note: '已完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程竣工', plan: '2026年8月30日', done: false, dept: '规划建设部', staff: '葛树 18395598808',
          note: '研发楼主体已验收；3号厂房施工完毕，验收资料准备中', next: '推进3号厂房竣工验收，研发楼外墙施工' },
        { name: '设备进场、安装调试', plan: '2026年6月30日', done: true, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '以都爱车业二期纳统，纳统时间2026年6月，设备已开票267万元', next: '已完成' },
        { name: '纳统', plan: '2025年12月31日', done: true, note: '已完成', dept: '经济运行部', staff: '花雪莹 18356163180' }
      ]
    },

    {
      id: 'p6', seq: 6, short: '金达光伏', tag: '光伏构件',
      name: '新型合金光伏构件制造项目',
      investor: '安徽金达节能材料发展有限公司',
      company: '安徽金达行光伏科技有限公司',
      contact: '张卫兵', phone: '15055018350',
      pos: { x: 24, y: 53 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2026年6月23日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2026年5月26日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2026年6月23日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2026年6月23日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '环评手续', plan: '2026年12月30日', done: false, dept: '安环部', staff: '林化其 17305619253',
          note: '已确定第三方，正在开展前期工作', next: '跟进环评报告编制进度' },
        { name: '设备进场、安装调试', plan: '2026年8月20日', done: true, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '8月19日现场已到2套冷轧成型机，另2套全自动光伏钢边框生产线9月9日已到场', next: '已完成' },
        { name: '纳统', plan: '2026年9月30日', done: false, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '纳统申报资料于2026年8月20日已提交区统计局，正在逐级审核中', next: '跟进逐级审核结果' },
        { name: '入规', plan: '2027年9月30日', done: false, dept: '经济运行部', staff: '谢逸雯 18109613023',
          note: '待企业建成试运营后根据订单情况制定入规计划', next: '关注企业投产经营情况' }
      ]
    },

    {
      id: 'p7', seq: 7, short: '陀普科技', tag: '固态电池',
      name: '年产0.5GWh固态电池生产项目',
      investor: '佛山陀普科技有限公司',
      company: '淮北陀普科技有限公司',
      contact: '艾群', phone: '18022280893',
      pos: { x: 38, y: 60 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2026年3月25日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2026年3月25日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2026年3月26日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2026年12月30日', done: false, note: '未完成', dept: '经济运行部', staff: '葛嘉湘 17756148871', next: '督促企业委托第三方编制节能审查报告' },
        { name: '环评手续', plan: '2026年12月30日', done: false, dept: '安环部', staff: '林化其 17305619253',
          note: '已确定第三方，正在开展前期工作', next: '跟进环评报告编制进度' },
        { name: '施工许可证', plan: '2026年9月30日', done: false, dept: '规划建设部', staff: '张贝贝 18356121504',
          note: '正在进行规划修改', next: '推进施工许可证办理，月底前完成' },
        { name: '工程开工', plan: '2026年9月30日', done: false, note: '未完成', dept: '规划建设部', staff: '张贝贝 18356121504' },
        { name: '厂房装修', plan: '2026年9月30日', done: false, note: '未完成', dept: '规划建设部', staff: '张贝贝 18356121504' },
        { name: '工程竣工', plan: '2026年11月30日', done: false, note: '未完成', dept: '规划建设部', staff: '张贝贝 18356121504' },
        { name: '设备进场、安装调试', plan: '2026年11月15日', done: false, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '厂房提升改造完成后设备方可进场，设备尚未采购', next: '跟进企业厂房提升改造进度' },
        { name: '纳统', plan: '2026年12月30日', done: false, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '厂房提升改造完成后设备方可进场', next: '跟进厂房改造进度及设备采购计划' },
        { name: '入规', plan: '2027年9月30日', done: false, dept: '经济运行部', staff: '谢逸雯 18109613023',
          note: '待企业建成试运营后根据订单情况制定入规计划', next: '关注企业投产经营情况' }
      ]
    },

    {
      id: 'p8', seq: 8, short: '国镁新材料', tag: '镁合金新材料',
      name: '年产2.4万吨镁合金新材料项目',
      investor: '安徽国镁新材料科技有限公司',
      company: '安徽国镁新材料科技有限公司',
      contact: '宗瑞洋', phone: '13731851388',
      pos: { x: 16, y: 60 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2026年7月7日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2026年6月18日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2026年7月8日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '2026年12月30日', done: false, note: '未完成', dept: '经济运行部', staff: '葛嘉湘 17756148871', next: '督促企业委托第三方编制节能审查报告' },
        { name: '环评手续', plan: '2026年12月30日', done: false, dept: '安环部', staff: '林化其 17305619253',
          note: '8月19日已进行一次公示，现正进行现状检测和编写初稿', next: '跟进编写进度' },
        { name: '施工许可证', plan: '2026年9月30日', done: false, dept: '规划建设部', staff: '葛树 18395598808',
          note: '图纸设计已完成，待土地过户后办理施工许可', next: '协调解决土地过户资金问题',
          issue: '企业资金困难，无法缴纳土地证过户费用2400余万元，正在向建行及工行贷款，银行一直未批' },
        { name: '工程开工', plan: '2026年9月30日', done: false, note: '未完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程竣工', plan: '2027年3月30日', done: false, note: '未完成', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '设备进场、安装调试', plan: '2026年12月31日', done: false, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '厂房建设完成后方可购买设备进场，暂无采购计划', next: '跟进厂房建设进度' },
        { name: '纳统', plan: '2026年12月31日', done: false, dept: '经济运行部', staff: '花雪莹 18356163180',
          note: '厂房建设完成后设备方可进场，暂无采购计划', next: '跟进厂房建设进度及设备采购计划' },
        { name: '入规', plan: '2027年9月30日', done: false, dept: '经济运行部', staff: '谢逸雯 18109613023',
          note: '待企业建成试运营后根据订单情况制定入规计划', next: '关注企业投产经营情况' }
      ]
    },

    {
      id: 'p9', seq: 9, short: '金石机器人', tag: '智能装备',
      name: '金石机器人长三角生产基地项目',
      investor: '金石机器人常州股份有限公司',
      company: '淮北金石机器人有限公司',
      contact: '胡文轻', phone: '18505209106',
      pos: { x: 52, y: 15 },
      images: [],
      nodes: [
        { name: '投资协议签订', plan: '2026年9月16日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '工商注册', plan: '2026年9月15日', done: true, note: '已完成', dept: '招商部', staff: '杨欢 18656101131' },
        { name: '立项备案', plan: '2026年9月17日', done: true, note: '已完成', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '能评手续', plan: '—', done: false, note: '待启动', dept: '经济运行部', staff: '葛嘉湘 17756148871' },
        { name: '环评手续', plan: '—', done: false, note: '待启动', dept: '安环部', staff: '林化其 17305619253' },
        { name: '施工许可证', plan: '—', done: false, note: '待启动', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程开工', plan: '—', done: false, note: '待启动', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '厂房装修', plan: '—', done: false, note: '待启动', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '工程竣工', plan: '—', done: false, note: '待启动', dept: '规划建设部', staff: '葛树 18395598808' },
        { name: '设备进场、安装调试', plan: '—', done: false, note: '待启动', dept: '经济运行部', staff: '花雪莹 18356163180' },
        { name: '纳统', plan: '—', done: false, note: '待启动', dept: '经济运行部', staff: '花雪莹 18356163180' },
        { name: '入规', plan: '—', done: false, note: '待启动', dept: '经济运行部', staff: '谢逸雯 18109613023' }
      ]
    }
  ]
};

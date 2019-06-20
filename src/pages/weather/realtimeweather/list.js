export const list = [
    {
        title: '灌溉量',
        titleTwo: '灌溉次数',
        icon: 'copy',
        amount: 300,
        times: 10
    },
    {
        title: '施肥量',
        titleTwo: '施肥次数',
        icon: 'copy',
        amount: 500,
        times: 30
    },
    {
        title: '',
        titleTwo: '植保次数',
        icon: 'copy',
        amount: '',
        times: 10
    },
    {
        title: '',
        titleTwo: '园艺次数',
        icon: 'copy',
        amount: '',
        times: 20
    }
];
export const nav = [
    {
        'key': 0,
        'title': '灌溉分析',
        'url': '/'
    },
    {
        'key': 1,
        'title': '施肥分析',
        'url': '/'
    },
    {
        'key': 2,
        'title': '植保分析',
        'url': '/'
    },
    {
        'key': 3,
        'title': '园艺分析',
        'url': '/'
    }
];
export const chartLegend = {
    watering: ['实际灌溉量', '计划灌溉量'],
    wateringTimes: ['实际灌溉次数', '计划灌溉次数'],
    fertilization: ['实际施肥量', '计划施肥量'],
    fertilizationTimes: ['实际施肥次数', '计划施肥次数']
};
/*export const showTime = () => {
    const show_day = ['周日','周一', '周二', '周三', '周四', '周五', '周六' ];
    let timeType = '';
    const time = new Date();
    const year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    date = date < 10 ? `0${date}`: date;
    const day = time.getDay();
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let second = time.getSeconds();
    month = month > 10 ? `0${month}` : month;
    if (hour >= 0 && hour < 6) {
        timeType = '凌晨';
    }
    if (hour >= 6 && hour < 12) {
        timeType = '上午';
    }
    if (hour >= 12 && hour < 18) {
        timeType = '下午';
    }
    if (hour >= 18 && hour < 24) {
        timeType = '晚上';
    }
    hour < 10 ? hour = `0${hour}` : hour;
    minutes < 10 ? minutes = `0${minutes}` : minutes;
    second < 10 ? second = `0${second}` : second;
    const timeNow = `${year}-${month}-${date} ${show_day[day]} ${timeType} ${hour}:${minutes}:${second}`;
    return timeNow;
};*/


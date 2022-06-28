module.exports = {
    // format_date: date => {
    //     return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
    //         date
    //     ).getFullYear()}`;
    //     },
    format_date: date => {
        return `${new Date(date).toLocaleDateString('en-US', {timeZone:'America/New_York'})}`;
        }
    }
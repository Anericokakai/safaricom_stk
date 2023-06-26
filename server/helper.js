// !Function to generate time stamp
const generate_Time_stamp = () => {
  const date = new Date();
  const stamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  return stamp;
};
export default generate_Time_stamp;

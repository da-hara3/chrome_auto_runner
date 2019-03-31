const waitOperation = async (getElement) => {
  const TRY_LIMIT = 1000000;
  let tryCount = 0;
  return new Promise((resolve, reject) => {

    const target = getElement();
    if (target) {
      setTimeout(() => {
        console.log("out");
        return resolve()
      }, 300)
    }

  });
};



async function test() {
  await waitOperation(() => document.login_fm);
  console.log("test")

}
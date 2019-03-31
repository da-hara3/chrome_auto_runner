javascript:(async function(){
const waitOperation = async (getElement) => {
  const TRY_LIMIT = 1000000;
  let tryCount = 0;
  return new Promise((resolve, reject) => {
    while(tryCount < TRY_LIMIT){
      const target = getElement();
      if (target) {
        resolve();
        return
      }
      tryCount++;
      if (tryCount > TRY_LIMIT) {
        reject();
        return;
      }
    }
  });
};

const pageLoad = async (url, getElement) => {
  document.location.href = url;
  return waitOperation(getElement);
};

await pageLoad("https://shisetsu.city.arakawa.tokyo.jp/stagia/reserve/gin_menu", () => document.MultiForm);
await waitOperation(() => document.MultiForm);
document.MultiForm.submit();

await waitOperation(() => document.login_fm);
document.getElementById("user").value = "";
document.getElementById("password").value = "";
const g_sessionId = Array.prototype.slice.call(document.login_fm.children).find(node => node.name === "g_sessionid").value;
document.login_fm.submit();

await waitOperation(() => document.getElementById("local-navigation"));
document.location.href = `https://shisetsu.city.arakawa.tokyo.jp/stagia/reserve/gml_z_group_sel_1?u_genzai_idx=0&g_kinonaiyo=17&g_sessionid=${g_sessionId}`


})();

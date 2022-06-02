<template>
  <div class="home">
    <button @click="sendAction({ directive: 'select' })">选择</button>
    <button @click="sendAction({ directive: 'cancelSelect' })">取消选择</button>
    <button @click="sendAction({ directive: 'browser.open', data: { url } })">打开百度</button>
    <button @click="sendAction({ directive: 'browser.close', data: {tabId} })">关闭百度</button>
    <button @click="sendAction({ directive: 'browser.closeAll', data: {} })">全部关闭</button>
    <button @click="sendAction({ directive: 'browser.reload', data: {tabId} })">刷新</button>
    <button @click="sendAction({ directive: 'browser.goForward', data: {tabId} })">前进</button>
    <button @click="sendAction({ directive: 'browser.goBack', data: {tabId} })">后退</button>



    <button
      @click="sendAction({ directive: 'element.setInput', data: { tabId: tabId, xpath: xpath, selector: selector, value: 23333 } })">设置input值</button>
    <button
      @click="sendAction({ directive: 'setInputValue', data: { tabId: tabId, xpath: xpath, selector: selector, value: true } })">设置checkbox</button>
    <button
      @click="sendAction({ directive: 'setInputValue', data: { tabId: tabId, xpath: xpath, selector: selector, value: 23333 } })">设置下拉框</button>

    <br />
   <span>xpath</span> <input v-model="xpath" />
   <span>selector</span> <input v-model="selector" />
   <span>tabId</span> <input v-model="tabId" />
   <span>url</span> <input v-model="url" />

    <button @click="getData()">获取数据</button>
    <button @click="toNextPage()">点击元素</button>
    <button @click="sendAction({ directive: 'scroll', data: { url: url, scrollX: Infinity } })">滚动到底部</button>
    <button @click="sendAction({ directive: 'executeScript', data: { url: url, code: 'alert(2333)' } })">执行脚本</button>

    <div>
      <pre style="width:100%">
        {{ res }}
      </pre>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
export default {
  name: "Home",
  data() {
    return {
      xpath: "233",
      selectedPath: "",
      url: 'https://www.baidu.com/',
      res: "",
      selector: '',
      tabId:''
    };
  },
  mounted() {
    ipcRenderer.on("receive", (event, message) => {
      console.log('receive',message)
      if(message.directive==='getXpath'){
        this.xpath=message.res.xpath
      }
      if(message.directive==='browser.open'){
        this.tabId=message.res.tabId
      }
    });
  },
  methods: {
    sendAction(arg) {
      console.log("send",arg)
      ipcRenderer.send("send-action", JSON.stringify(arg));
    },
    toNextPage() {
      ipcRenderer.send(
        "send-action",
        JSON.stringify({
          directive: "element.click",
          data: {
            url: this.url,
            xpath: this.xpath,
          },
        })
      );
    },
    getData() {
      ipcRenderer.send(
        "send-action",
        JSON.stringify({
          directive: "getPageData",
          data: {
            url: this.url,
            columns: [{ dataIndex: "col1", title: "col1", xpath: this.xpath }],
          }
        })
      );
    },
  },
};
</script>

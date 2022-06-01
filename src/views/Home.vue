<template>
  <div class="home">
    <span>url:{{ url }}</span>
    <p>xpath:{{ xpath }}</p>
    <br />
    <button @click="sendAction({ directive: 'select' })">选择</button>
    <button @click="sendAction({ directive: 'cancelSelect' })">取消选择</button>
    <button @click="sendAction({ directive: 'openPage', data: { url: 'https://www.baidu.com/' } })">打开百度</button>
    <button @click="sendAction({ directive: 'closePage', data: { url: 'https://www.baidu.com/' } })">关闭百度</button>
    <button
      @click="sendAction({ directive: 'setInputValue', data: { url: url, xpath: xpath, selector: selector, value: 23333 } })">设置input值</button>
    <button
      @click="sendAction({ directive: 'setInputValue', data: { url: url, xpath: xpath, selector: selector, value: true } })">设置checkbox</button>
    <button
      @click="sendAction({ directive: 'setInputValue', data: { url: url, xpath: xpath, selector: selector, value: 23333 } })">设置下拉框</button>

    <br />
    <input v-model="xpath" />
    <input v-model="selector" />

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
      url: '',
      res: "",
      selector: '',
    };
  },
  mounted() {
    ipcRenderer.on("get-xpath", (event, message) => {
      console.log(message)
      this.xpath = message.res.xpath;
      this.url = message.res.url
    });
    ipcRenderer.on("get-data", (event, message) => {
      console.log("2333:", message);
      this.res = message.res.dataSource;
    });
    ipcRenderer.on("click-by-xpath", (event, message) => {
      this.url = message.res.url
    });
  },
  methods: {
    sendAction(arg) {
      console.log(arg)
      ipcRenderer.send("send-action", JSON.stringify(arg));
    },
    toNextPage() {
      ipcRenderer.send(
        "send-action",
        JSON.stringify({
          directive: "clickByXpath",
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

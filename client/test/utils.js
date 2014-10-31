
function setResponse(object){
  MockAjax = {
    latency: 0,
    response: JSON.stringify(object)
  };
}

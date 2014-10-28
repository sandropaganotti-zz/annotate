
function setResponse(object){
  MockAjax = {
    latency: 1,
    response: JSON.stringify(object)
  };
}

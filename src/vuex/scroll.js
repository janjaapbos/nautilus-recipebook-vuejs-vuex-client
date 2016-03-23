import * as types from './types'
import store from './store'

document.addEventListener('scroll', function(event)
  {
    store.dispatch(types.SCROLL_LAST_EVENT, event)

    var element = event.target.scrollingElement;
    //console.log(element.scrollHeight, element.scrollTop, element.clientHeight)
    //if (element.scrollHeight - element.scrollTop == element.clientHeight)
    if ((parseInt(element.scrollHeight) < 6000) || (parseInt(element.scrollHeight) - parseInt(element.scrollTop) < 4000))
    {
      store.dispatch(types.SCROLL_REACHED_BOTTOM, event)
      for (var k in store.state.actions[types.SCROLL_REACHED_BOTTOM]) {
        var action = store.state.actions[types.SCROLL_REACHED_BOTTOM][k]
        if ((action.enabled == true) && (action.running == false)) {
          var now = new Date()
          if ((action.timestamp == null) || (now.getTime() - action.timestamp > 1000)) {
            console.log("Executing action", action)
            action.timestamp = now
            action.run()
          }
        }
      }
    }
  }
)

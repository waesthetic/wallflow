export default defineWebSocketHandler({
  async open(peer) {
    try {
      const { user } = await requireUserSession(peer)
      const topic = `cart:${user.id}`
      peer.context.topic = topic
      peer.subscribe(topic)
    } catch {
      peer.close(4001, 'Unauthorized')
    }
  },

  message(peer) {
    const topic = peer.context.topic as string

    if (topic) {
      peer.publish(topic, 'updated') 
    }
  }
})
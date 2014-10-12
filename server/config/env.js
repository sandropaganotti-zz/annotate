module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'test':
      return {
        db: 'mongodb://localhost/remoteStorageTest'
      }
    default:
      return {
        port: process.env.PORT || 3000,
        db: process.env.MONGODB_URL || 'mongodb://localhost/remoteStorage'
      }
  }
};

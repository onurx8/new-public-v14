
let Bewrq = [

  {
    name: "Voice",
    namespace: "KyLockz",
    script: 'index.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Controller"
  },
  
  {
    name: "Control",
    namespace: "KyLockz",
    script: 'index.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Mainframe"
  },

 
]

    
  

module.exports = {
  apps: Bewrq
};




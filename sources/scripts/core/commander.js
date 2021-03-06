function Commander()
{
  this.el = document.createElement('yu');
  this.el.id = "commander";
  this.input_el = document.createElement('input');
  this.input_el.value = "";

  this.install = function()
  {
    this.el.appendChild(this.input_el);
    ronin.el.appendChild(this.el);
    this.input_el.focus();
  }

  this.validate = function(q = ronin.commander.query())
  {
    if(!ronin.modules[q.module]){ console.log("Unknown module",q.module); return; }
    if(q.raw.indexOf("$") > -1){ console.log("Variables present"); return; }
    if(q.raw.indexOf(";") > -1){ this.validate_multi(q); return; }

    // Run methods
    for(method_id in q.methods){
      var method_param = q.methods[method_id];
      if(!ronin.modules[q.module].methods[method_id]){ console.log("Missing method",method_id); return; }
      ronin.modules[q.module].methods[method_id].run(method_param);
    }

    ronin.commander.input_el.value = "";
    ronin.hint.update();
    ronin.guide.update();
  }

  this.queue = [];

  this.validate_multi = function(q)
  {
    var queue = [];
    var queries = q.string.split(";");

    for(id in queries){
      var q = new Query(queries[id].trim());
      queue.push(q);
    }
    this.queue = queue;
    this.run_queue();
  }

  this.run_queue = function()
  {
    if(ronin.commander.queue.length == 0){ return; }
      
    ronin.commander.validate(ronin.commander.queue[0]);

    ronin.commander.queue = ronin.commander.queue.splice(1,ronin.commander.queue.length-1)

    setTimeout(ronin.commander.run_queue,250);
  }

  this.update = function()
  {
    var q = ronin.commander.query();
    if(ronin.modules[q.module] && ronin.modules[q.module]["preview"]){
      ronin.modules[q.module].preview(q);
    } 
    ronin.hint.update();
    ronin.guide.update();
  }

  this.autocomplete = function()
  {

    var target_module = ronin.commander.query().module;

    var ac = ronin.modules[target_module] ? ronin.hint.find_autocomplete(ronin.modules[target_module].methods,":") : ronin.hint.find_autocomplete(ronin.modules," ")

    this.focus();
    if(ac.lenght < 1 || !ac[0]){ return; }
    if(ronin.commander.query().string.length < 1){ return; }

    this.append(ac[0]);
  }

  this.on_input = function(e)
  {
    ronin.commander.update();
  }

  this.is_focused = function()
  {
    return this.input_el === document.activeElement;
  }

  this.focus = function()
  {
    this.input_el.focus();
  }

  this.blur = function()
  {
    this.input_el.blur();
  }

  this.active_module = function()
  {
    return this.query().module;
  }

  this.inject = function(str)
  {
    ronin.commander.input_el.value = str;
    ronin.commander.update();
    ronin.commander.show();
  }

  this.append = function(str)
  {
    ronin.commander.input_el.value += str;
    ronin.commander.update();    
  }

  this.activate = function()
  {
    ronin.commander.autocomplete();
    ronin.commander.show();
    setTimeout(()=>{ronin.commander.focus},100)
  }

  this.deactivate = function()
  {
    this.blur();
    this.hide();
  }

  this.show = function()
  {
    this.el.className = "visible";
  }

  this.hide = function()
  {
    this.el.className = "hidden";
  }

  this.query = function()
  {
    return new Query(ronin.commander.input_el.value);
  }
}
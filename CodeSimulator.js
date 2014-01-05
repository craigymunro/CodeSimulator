CodeSimulator = new Class.create({
	
	initialize: function(args)
	{
		this.output = args.output;
		this.variables = ["server", "node", "val", "hash", "this", "public", "function", "argv"];
		this.conditionals = ["IN", "HAVING", "==", "mod", "===", "!=", "equals", "array()", "*", "div", "+", "--", "exec", "OR", "||", "&&"];
		this.booleans = ["&&", "||", "OR", "AND", ">", "!==", "===", "equals", "contains"];
		this.separators = ["::", ".", "@", "->"];
		this.commands = "exec,save,pushd >,pbpaste,pbcopy,ssh,shh-copy-id,rm,rm -rf,cat,less,more,ls,ls -al,pwd,passwd,logout,reset,cd,rmdir,mkdir,cp,mv,move,copy,history,!!,~,*,man,ctrl,chmod,chown,wcfile,wall,cat,grep,echo,print,save,write,read".split(",");
		this.buffer = "";
		this.tab = 0;
		this.position = 0;
		this.methods = "Import,Using,Include,Require,With".split(",");
		this.imports = ["FileWriter","Storage","Math","Print","Decorate","UI","Swing","Component","View","Display","Local","Remote","Listener","Runtime","Aux","Console","Debug","Global","Root","Base","Common","Core","Admin","Static","Class", "Text", "String", "Lang", "FTP", "Client", "Web", "Gopher", "Net", "Scanner", "Authorise"];
		this.exceptions = ["", "Storage", "Pointer", "Web", "System", "Constraint", "EmptyLineException", "FloatingPoint", "NotFound", "Processor", "Binding", "Cast", "StaticLookup", "Gateway", "Services", "Model", "Backtrace", "PortHandler", "FileSystemWriter", "Execution"];
		this.assigners = "def,let,set,assign,define,dim".split(",");
		this.tasks = "truncate,clip,denoise,smooth,set,remove,splice,increment,traverse,compile,check,compare,examine,filter,authorise".split(",");
		this.tables = "keys,private,userspace,users,auth,admin,privileges,remote,network,people".split(",");
		this.fields = "key,bool,name,username,pass,password,hash,authtoken,token,authkey,key,status,keywords,lastseen,wanted".split(",");
		this.openers = ["import", "with", "using"];
		this.timeout = 0;
		this.constants = "float,bool,void,int,string,STATIC,Public,Private,CONST,MAX,MIN,readonly".split(",");
		this.args = "P,V,output,input,args,method,verbose,print,silent".split(",");
		this.caret = new Element("span", { "class": "caret" }).update("&nbsp;");
		this.terminal = new Element("span", { "class": "terminal" });
		
		new Insertion.Top(this.output, this.terminal);
		new Insertion.Bottom(this.output, this.caret);

		this.run();
	},
	
	run: function()
	{
		this.output.addClassName("code-simulator");
		this.genImport();
		this.genConstants();
		
		this.block();
		this.print();
	},
	
	block: function()
	{		
		for(a = 0; a < this.random(6, 10); a++)
		{
			switch(this.random(1,10))
			{
				case 1:
					this.genTryCatch();
				break;
				
				case 2:
					this.genFor();
				break;
	
				case 3:
					this.genForeach();
				break;
				
				case 4:
					this.genWhile();
				break;
				
				case 5:
					this.genSwitch();
				break;

				case 6:
					this.genSQL();
				break;

				case 7:
					this.genClass();
				break;
				
				case 8:
					this.genVariableAssign();
				break;
				
				case 9:
					this.genExec();
				break;
								
				default:
					this.genExecBlock(this.random(4,10));
				break;
			}
		}
	},
	
	genSQL: function()
	{
		var type = this.arrayRand(["insert","select","delete"]);
		switch(type)
		{
			case "delete":
				q = this.sqlDelete();
			break;
			
			case "insert":
				q = this.sqlInsert();
			break;

			case "select":
				q = this.sqlSelect();
			break;

		}
		this.buff("mysql_connect(" + this.random(1,255) + "." + this.random(1,255) + "." + this.random(1,255) + "." + this.random(1,255) + ":" + this.random(1000,9000) + ", " + this.genValue() + ", " + this.genValue() + ") or die('Could not connect: ' . mysql_error());");
		this.buff("echo 'Connected successfully';");
		this.blank();
	
		this.buff("$query = $this->db->query(");
			this.indent();
			this.buff("'" + q + "'");
			this.outdent();
		this.buff(");");

		this.buff("mysql_close($this->db);");
		this.blank();
	},

	sqlSelect: function()
	{
		fields = [];
		values = [];

		var loop = this.random(3,8);
		for(i = 0; i < loop; i++)
		{
			fields.push(this.arrayRand(this.fields));
			values.push(this.genValue());
		}

		return "SELECT " + fields.join(", ") + " FROM " + this.arrayRand(this.tables) + "." + this.arrayRand(this.tables) + " WHERE " + fields[0] + " " + this.arrayRand(this.conditionals) + " " + values[0];
	},
	
	sqlInsert: function()
	{
		fields = [];
		values = [];

		var loop = this.random(3,8);
		for(i = 0; i < loop; i++)
		{
			fields.push(this.arrayRand(this.fields));
			values.push(this.genValue());
		}

		return "INSERT INTO " + this.arrayRand(this.tables) + " (" + fields.join(",") + ") VALUES (" + values.join(",") + ")";
	},

	sqlDelete: function()
	{
		field = this.arrayRand(this.fields);
		value = this.genValue();

		return "DELETE FROM " + this.arrayRand(this.tables) + " WHERE " + field + " " + this.arrayRand(this.conditionals) + " " + value;
	},
	
	genImport: function()
	{
		this.buff("#!/bin/sh\n");

		this.buff("//DEPENDENCIES");
		for(i = 0; i < this.random(4, 10); i++)
		{
			str = this.arrayRand(this.methods) + " " + this.arrayRand(this.imports) + "." + this.arrayRand(this.imports).toLowerCase() + ";";
			this.buff(str);
		}
		this.blank();
	},

	genConstants: function()
	{
		this.buff("//CONSTANTS");
		for(i = 0; i < this.random(4, 10); i++)
		{
			str = this.arrayRand(this.constants) + "_" + this.genVariable() + " = " + this.genValue() + ";";
			this.buff(str);
		}
		this.blank();
	},
		
	genSwitch: function()
	{
		this.buff("switch(" + this.genVariable() + ") {");
		for(i = 0; i < this.random(2, 8); i++)
		{
			this.indent();
				this.genSwitchOption();
			this.outdent();
		}
		this.buff("}");
		this.blank();
	},

	genClass: function()
	{
		this.buff(this.arrayRand("public,private,static".split(",")) + " class " + this.genVariable() + " {");
			this.indent();
						
				for(i = 1; i <= this.random(1, 3); i++)
				{
					this.buff(this.arrayRand("public,private,static".split(",")) + " function " + this.arrayRand("get,set,main,init,revoke,delete,purge".split(",")) + this.genVariable() + "(args) {");
					for(j = 0; j < this.random(1, 3); j++)
					{
						this.indent();
							this.genExecBlock(this.random(1,3));
							this.buff("return " + this.genVariable() + ";");
						this.outdent();
					}
					this.buff("}");
				}
				
			this.outdent();
		this.buff("}");
	},
	
	genFunction: function()
	{
	
	},
	
	genSwitchOption: function()
	{
		this.buff("case " + this.genVariable(true) + ":");
			this.indent();
				this.genExecBlock(this.random(1, 9));
			this.outdent();
		this.buff("break;");
		this.blank();
	},
	
	genExecBlock: function(n)
	{
		if(this.tab < 12 && this.random(0,1) == 1)
		{
			this.block();
		}
		else
		{
			for(k = 0; k < n; k++)
			{
				switch(this.random(1,10))
				{
					case 1:
					case 2:
						this.buff("// " + this.arrayRand(this.tasks) + " " + this.arrayRand(this.imports) + " for " + this.arrayRand(this.variables));			
					break;
	
					case 3:
					case 4:
						this.buff("/* " + this.arrayRand(this.tasks) + " " + this.arrayRand(this.imports) + " for " + this.genValue() + " */ ");			
					break;
					
					case 5:
					case 6:
						this.genExec();
					break;
					
					case 7:
						this.genSQL();
					break;
	
					default:
						this.genVariableAssign();
					break;
				}
			}
		}
		this.blank();
	},
	
	genVariableAssign: function()
	{
		this.buff(this.arrayRand(this.assigners) + " " + this.genVariable() + " = " + this.genValue() + ";");
	},

	genValue: function()
	{
		switch(this.random(1,4))
		{
			case 1:
				return '"' + this.arrayRand("abcdefghijklmnopqrstuvwxyz".split("")) + '"';	
			break;
			
			case 2:
				return this.random(1,999999);			
			break;

			case 3:
				return "array(" + this.arrayRand(this.variables) + ")";
			break;
			
			case 4:
				return "function() { return " + this.arrayRand(this.variables) + "; }";
			break;

		}

	},
	
	genExec: function()
	{
		extra = (this.random(0,1) == 1 ? (" --" + this.arrayRand(this.args)) : "");
		this.buff(this.arrayRand(this.commands) + " " + this.genVariable() + "@" + this.genVariable() + extra + ";");
	},
	
	genWhile: function()
	{
		this.buff("while(" + this.genVariable(true) + " " + this.arrayRand(this.booleans) + " " + this.genVariable(true) + ") {");	
			this.indent();
			this.genExecBlock(this.random(1,3));
			this.outdent();
		this.buff("}");
		this.blank();
	},

	genTryCatch: function()
	{
		this.buff("try {");	
			this.indent();
			this.genExecBlock(this.random(1,10));
			this.outdent();
	
		for(j = 0; j < this.random(1, 4); j++)
		{
			this.buff("} catch (" + this.arrayRand(this.exceptions) + "Exception e) {");	
			this.indent();
			this.genExecBlock(this.random(1,10));
			this.outdent();
		}
		this.buff("}");	
		this.blank();		
	},
	
	genForeach: function()
	{
		this.buff("foreach(" + this.genVariable(true) + " as " + this.genVariable(true) + ") {");	
			this.indent();
			this.genExecBlock(this.random(1,10));
			this.outdent();
		this.buff("}");
		this.blank();
	},
	
	genFor: function()
	{
		var rand = this.random(0, 200);
		var variable = this.genVariable();
		var variable2 = this.genVariable();
				
		this.buff("for(" + variable + " = " + rand + "; " + variable + " <= " + variable2 + "; " + variable + "++) {");	
			this.indent();
			this.genExecBlock(this.random(1,10));
			this.outdent();
		this.buff("}");	
		this.blank();
	},
	
	genIf: function()
	{
		this.buff("if (" + this.genConditional() + ") {");
			this.indent();
				this.genExecBlock(1);
			this.outdent();
		this.buff("}");
		this.blank();
	},
		
	genVariable: function(multi)
	{
		return this.arrayRand(this.variables) + ( multi && this.random(0,2) > 0 ? this.arrayRand(this.separators) + this.genVariable() : "");
	},
	
	arrayRand: function(arr)
	{
		return arr[Math.floor(Math.random() * arr.length)];
	},
	
	genConditional: function()
	{
		var count = this.random(1,2);
		var buff = "";
		
		for(k = 0; k <= count; k++)
		{
			buff += this.genVariable() + " " + this.arrayRand(this.conditionals) + " " + this.genVariable();
			if(k < count)
			{
				buff += " " + this.arrayRand(this.booleans) + " ";
			}
		}
		
		return buff;
	},
	
	print: function()
	{
		this.output.scrollTop = this.output.scrollHeight;

		this.position++;
		this.terminal.update(this.terminal.innerHTML + this.buffer[0]);
		
		//Reduce buffer size by 1
		this.buffer = this.buffer.substr(1, this.buffer.length);
		
		if(this.buffer.length > 0)
		{		
			this.timeout = window.setTimeout(this.print.bind(this), this.random(2,10));
		}
		else
		{
			window.clearTimeout(this.timeout);
			this.run();
		}
	},
	
	random: function(min, max)
	{
		return Math.floor(Math.random() * (max - min) + min);
	},
	
	blank: function()
	{
		this.buff("");
	},
	
	buff: function(str)
	{
		if(this.tab > 0)
		{
			for(i = 0; i < this.tab; i++) {
				this.buffer += "    ";
			}
		}
				
		this.buffer = this.buffer + str + "\n";
	},
	
	indent: function()
	{
		this.tab++;
	},

	outdent: function()
	{
		this.tab--;
		if(this.tab < 0) this.tab = 0;
	}
});
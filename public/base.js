if (typeof String.prototype.startsWith != 'function') {
		 String.prototype.startsWith = function (prefix) {
     		  return this.slice(0, prefix.length) === prefix;
      };
}
if (typeof String.prototype.endsWith != 'function') {
		 String.prototype.endsWith = function (prefix) {
     		  return this.slice(-prefix.length) === prefix;
      };
}
if (typeof String.prototype.repeat != 'function') {
		String.prototype.repeat = function( num )
		{
				return new Array( num + 1 ).join( this );
		}
}

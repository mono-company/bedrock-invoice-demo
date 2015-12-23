const $ = require('jquery');
const Clipboard = require('clipboard');
const Codemirror = require('codemirror');
const config = require('../../core/config');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/jade/jade');
require('codemirror/mode/xml/xml');

const $codeBlocks = $('.br-sample-code .br-sample-markup');
const $codeButtons = $('.br-sample-show-code-btn');
const $copyButtons = $('.br-sample-copy-code-btn');
const clipboard = new Clipboard('.br-sample-copy-code-btn', {
  text: function (trigger) {
    return $(trigger).siblings('.br-sample-markup').find('.CodeMirror').get(0).CodeMirror.getValue();
  }
});

// Hide on init
$codeBlocks.hide();
$copyButtons.hide();

$codeButtons.on('click', function () {
  var $codeBlock = $(this).parents('.br-sample').find('.br-sample-markup');
  $codeBlock.toggle();
  $codeBlock.find('.CodeMirror').each(function (i, el) {
    el.CodeMirror.refresh();
  });
  $(this).parents('.br-sample').find('.br-sample-copy-code-btn').toggle();
});

$codeBlocks.each(function () {
  const code = $(this).text();

  $(this).empty();

  let editorOptions = {
    value: code,
    readOnly: true
  };

  switch (config.styleguide.snippetLanguage) {
    case 'jade':
      editorOptions.mode = 'jade';
      break;
    case 'html':
      editorOptions.mode = 'xml';
      editorOptions.htmlMode = true;
      break;
  }

  const editor = Codemirror(this, editorOptions);

  $(this).editor = editor;
});

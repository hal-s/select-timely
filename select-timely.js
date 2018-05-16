function selectTimely(option) {
    var flagSpans = document.getElementsByClassName('flagSpan');

    var res = {
        strLeft: option.strLeft,
        strRight: option.strRight
    }, indexArr = [];

    var i = j = 0, curIndex;

    var strLeft = res.strLeft.trim().split('\n').map(function(item, idx) {
        var str16 = (idx*16).toString(16);
        if(str16.length < 4) {
            for(var k=0, len=4-str16.length; k<len; k++) {
                str16 = '0' + str16;
            }
        }
        indexArr.push(str16);

        return item.split('  ').map(function(it) {
            return it.split(' ').map(function(num) {
                return '<span id="leftSpan' + i + '" class="flagSpan" data-index=' + i++ + '>' + num + '</span>';
            }).join(' ');
        }).join('<span id="leftSpan' + i + '" class="flagSpan" data-index=' + i++ + '>  </span>');
    }).join('\n');

    var strRight = res.strRight.trim().split('\n').map(function(item) {
        return item.split(' ').map(function(it) {
            return it.split('').map(function(flag) {
                return '<span id="rightSpan' + j + '" class="flagSpan" data-index=' + j++ + '>' + flag + '</span>';
            }).join('');
        }).join('<span id="rightSpan' + j + '" class="flagSpan" data-index=' + j++ + '> </span>');
    }).join('\n');

    var domStr = '<pre class="textLeft">' + strLeft + '</pre>'
                +'<pre class="textRight">' + strRight + '</pre>';

    root.innerHTML = domStr;

    function getSelectText(direction) {
        var selection = window.getSelection(),
        preId = direction + 'Span', children;
        if(!selection.isCollapsed) {
            var range = window.getSelection().getRangeAt(0);
            var container = document.createElement('div');
            container.appendChild(range.cloneContents());
            if(!container.children.length && (container.innerHTML == '0' || container.innerHTML == '00' || container.innerHTML - 0 !== 0) ) {
                var span = document.createElement('span');
                span.setAttribute('data-index', curIndex);
                container.appendChild(span);
            }
            [].slice.call(container.children).map(function(item) {
                console.log(preId + item.getAttribute('data-index'))
                document.getElementById( preId + item.getAttribute('data-index') ).className += ' span-select';
            });
            return container.children
        }
    }

    function bindEvent(option) {
        [].forEach.call(option.nodeList, function(node) {
            node.addEventListener(option.eventType, option.cb)
        })
    }

    bindEvent({
        nodeList: document.querySelectorAll('.flagSpan'),
        eventType: 'mouseup',
        cb: function() {
            curIndex = this.getAttribute('data-index');
        }
    })

    bindEvent({
        nodeList: document.querySelectorAll('.textRight'),
        eventType: 'mouseup',
        cb: function() {
            getSelectText('left');
        }
    })

    bindEvent({
        nodeList: document.querySelectorAll('.textLeft'),
        eventType: 'mouseup',
        cb: function() {
            getSelectText('right');
        }
    })

    window.onmousedown = function() {
        //取消页面选中的文字
        window.getSelection().removeAllRanges();
        //取消页面选中的select文字
        [].slice.call(flagSpans).forEach(function(item) {
            item.className = item.className.replace('span-select','');
        })
    };
}

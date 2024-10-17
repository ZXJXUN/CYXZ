// Script necessary for every page


const subjectIdToName = {
    1: "语文",
    2: "数学",
    3: "外语",
    4: "物理",
    5: "化学",
    6: "生物",
    7: "政治",
    8: "历史",
    9: "地理",
    255: "总分"
};

const subjectFullScore = {
    1: 150,
    2: 150,
    3: 150,
    4: 100,
    5: 100,
    6: 100,
    7: 100,
    8: 100,
    9: 100,
    255: 750
};


// 顶端导航栏和底部页脚的加载
let navbarHtml = null;
let footerHtml = null;

// 避免重复加载导航栏和页脚
$(function () {
    if (navbarHtml === null) {
        $.get("navbar.html", function (response) {
            navbarHtml = response;
            $("#navbar").html(navbarHtml);
            bindNavbarButton();

            // 在这里设置导航按钮的激活状态
            var navButtons = $('.navbar-button');
            navButtons.each(function () {
                var button = $(this);
                var buttonPath = button.attr('href');  // 获取按钮的 href 属性值
                if (buttonPath !== 'index.html') {
                    if (window.location.pathname.includes(buttonPath)) {
                        button.addClass('active');
                    } else {
                        button.removeClass('active');
                    }
                }
            });
        });
    } else {
        $("#navbar").html(navbarHtml);
        bindNavbarButton();
    }

    if (footerHtml === null) {
        $.get("footer.html", function (response) {
            footerHtml = response;
            $("#footer").html(footerHtml);
        });
    } else {
        $("#footer").html(footerHtml);
    }
});

// 在首次加载页面时设置初始状态
history.replaceState({ url: window.location.pathname }, null, window.location.pathname);

// 为导航栏按钮绑定点击事件
function bindNavbarButton() {
    // 绑定导航栏按钮和 logo 的点击事件
    $('.navbar-button').off('click').click(function (e) {
        e.preventDefault();  // 阻止默认的页面跳转行为

        // 获取要加载的页面的 URL
        var url = $(this).attr('href');
        // 加载页面内容
        loadPageContent(url);

        // 改变地址栏的 URL
        history.pushState({ url: url }, null, url);
    });

    // 监听 popstate 事件
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.url) {
            // 加载页面内容
            loadPageContent(e.state.url);
        }
    });
}

function loadPageContent(url) {
    // 使用 AJAX 加载页面内容
    $.get(url, function (data) {
        // 将 data 转换为 jQuery 对象
        var $data = $(jQuery.parseHTML(data, document, true));

        // 从加载的内容中提取 .main-content 的内容
        var mainContent = $data.filter('.main-content').add($data.find('.main-content')).html();

        // 检查提取的内容是否为空
        if (mainContent) {
            console.log('Content fetched successfully.');
            // 将提取的内容插入到当前页面的 .main-content 元素中
            $('.main-content').html(mainContent);
        } else {
            console.log('Failed to fetch content.');
        }

        // 更新页面标题
        var title = $data.filter('title').text();
        $('head title').text(title);

        // 使用正则表达式从 data 中提取 <body> 元素的 id 属性
        var bodyIdMatch = data.match(/<body[^>]*id="([^"]*)"/i);
        var newBodyId = bodyIdMatch ? bodyIdMatch[1] : '';

        // 更新 body 的 id
        $('body').attr('id', newBodyId);

        // 移除所有导航按钮的 active 类
        var navButtons = document.querySelectorAll('.navbar-button');
        navButtons.forEach(function (button) {
            button.classList.remove('active');
        });

        // 设置导航栏按钮的激活状态
        var pageName = document.body.id;
        console.log('Loading page: ' + pageName + '.html');
        if (pageName !== 'index') {
            var navButton = document.querySelector('.navbar-button[href="' + pageName + '.html"]');
            navButton.classList.add('active');
        }

        // 获取所有当前页面的<link>元素
        var oldLinks = Array.from(document.getElementsByTagName('link'));

        // 从加载的内容中提取<link>元素
        var newLinks = $data.filter('link[rel="stylesheet"]').add($data.find('link[rel="stylesheet"]'));

        newLinks.each(function () {
            var cssHref = this.href;

            // 检查CSS文件是否已经被加载过
            var isCssLoaded = Array.prototype.some.call(document.styleSheets, function (styleSheet) {
                return styleSheet.href === cssHref;
            });

            if (!isCssLoaded) {
                // 创建一个新的<link>元素并设置其href属性为CSS文件的URL
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssHref;

                // 将新的<link>元素添加到<head>元素中
                document.head.appendChild(link);
            }
        });

        // 移除旧的<link>元素
        oldLinks.forEach(function (link) {
            // 检查新加载的内容中是否包含这个<link>元素
            var isLinkInNewContent = Array.prototype.some.call(newLinks, function (newLink) {
                return newLink.href === link.href;
            });

            if (!isLinkInNewContent && !link.href.includes('navbar.css') && !link.href.includes('footer.css') && !link.href.includes('main.css')) {
                link.parentNode.removeChild(link);
            }
        });

        // 加载新的脚本
        $data.filter('script').add($data.find('script')).each(function () {
            var scriptSrc = this.src;


            // 如果脚本没有被加载过，则加载脚本
            var isScriptLoaded = Array.prototype.some.call(document.scripts, function (script) {
                return script.src === scriptSrc;
            });
            console.log(`Script src: ${scriptSrc}, ${isScriptLoaded ? 'loaded' : 'not loaded'}`);
            if (!isScriptLoaded) {
                var script = document.createElement('script');
                if (scriptSrc) {
                    script.src = scriptSrc;
                    console.log('Loading new script: ' + scriptSrc);  // 输出新加载的脚本的 src 属性

                    // 如果是加载 person.js，设置一个全局标记
                    if (scriptSrc.endsWith('person.js')) {
                        window.isPersonJsLoadedFirstTime = true;
                    }

                    // 如果是加载 class.js，设置一个全局标记
                    if (scriptSrc.endsWith('class.js')) {
                        window.isClassJsLoadedFirstTime = true;
                    }

                    if (scriptSrc.endsWith('data.js')) {
                        window.isDataJsLoadedFirstTime = true;
                    }
                } else {
                    script.text = this.innerText;
                }
                document.head.appendChild(script);
            } else if (scriptSrc.endsWith('person.js')) {
                // 如果 person.js 已经被加载过，设置全局标记
                window.isPersonJsLoadedFirstTime = false;
            } else if (scriptSrc.endsWith('class.js')) {
                // 如果 class.js 已经被加载过，设置全局标记
                window.isClassJsLoadedFirstTime = false;
            } else if (scriptSrc.endsWith('data.js')) {
                window.isDataJsLoadedFirstTime = false;
            }
        });

        // 如果加载的是 person.html，且 person.js 不是第一次被加载，则调用实例
        if (url === 'person.html' && !window.isPersonJsLoadedFirstTime) {
            console.log('Person.js already loaded, initializing PersonPage instance.');
            window["personPage"] = new PersonPage();
            window.personPage.initEventListeners();
        }

        if (url === 'class.html' && !window.isClassJsLoadedFirstTime) {
            console.log('class.js already loaded, initializing ClassPage instance.');
            window["classPage"] = new ClassPage();
            window.classPage.initEventListeners();
        }

        if (url === 'data.html' && !window.isDataJsLoadedFirstTime) {
            console.log('data.js already loaded, initializing DataPage instance.');
            window["dataPage"] = new DataPage();
            window.dataPage.initEventListeners();
        }
    });
}
var IndexModule = (function () {
    var $root
    var random_code
    function init() {
        $root = $('.wrap');
        eventBind();
        checkPopup();
    }

    function eventBind(){
        $root.on('click','#submit',loginUser)
    }

    function sendPhoneNumber(){
        var phone_el = document.getElementById('phone');
        if(phone_el.value.replace(/\s/g,'') == ''){
            alert(ALERT_TEXT_OBJ.login[2]) //폰번호 입력
            phone_el.focus();
            return false;
        }
        // 밑에 영역은 추후 ajax로 변경예정
        random_code = '';
        for(var i=0;i<4;i++){
            var jb_random = String(Math.floor(Math.random() * 10));
            random_code += jb_random;
        }
        alert('인증번호는 [' + random_code+'] 입니다.');
        var input_els = document.querySelectorAll('.login_form input[type="text"]');
        for(var i=0;i<input_els.length;i++){
            input_els[i].readOnly = true;
        }
        var code_el = document.getElementById('code');
        var login_btn_el = document.getElementById('submit');
        code_el.readOnly = false;
        login_btn_el.style.display = ''
    }

    function loginUser(){
        var code_el = document.getElementById('code');
        if(code_el.value.replace(/\s/g,'') == ''){
            alert('인증번호를 입력해주세요.');
            return false;
        }else if(code_el.value != random_code){
            alert('잘못된 인증번호입니다.');
            return false;
        }
        var input_els = document.querySelectorAll('.login_form input[type="text"]');
        for(var i=0;i<input_els.length;i++){
           if(input_els[i].value.replace(/\s/g,'') === ''){
               alert(ALERT_TEXT_OBJ.login[i]);
               return false;
           }
        }
        var check_el = document.querySelector('.login_form input[type="checkbox"]');
        console.log(check_el)
        if(!check_el.checked){
            alert(ALERT_TEXT_OBJ.login[4]);
            check_el.focus();
            return false;
        }
        alert('핸드폰 인증 및 로그인이 완료되었습니다.\n ‘HY SYMPOSIUM 2020’ 에 오신 것을 환영합니다!')
        // location.href='./list.html';
    }

    function checkPopup(){
        var today = new Date();
        var notice_start_date = new Date('2020-09-11');
        var start_date = new Date('2020-09-14');
        var end_date = new Date('2020-09-21');
        end_date.setHours(23,59,59,59)
        var date_time_obj = {
            'today' : today.getTime(),
            'start' : start_date.getTime(),
            'end' : end_date.getTime(),
            'notice' : notice_start_date.getTime()
        }
        if(date_time_obj.today > date_time_obj.start && date_time_obj.today < date_time_obj.end){
            alert('트래픽이 집중되는 시간에는 원활한 수강이 어려울 수 있습니다.\n이점 양해 바랍니다.');
        }
        if(date_time_obj.today > date_time_obj.notice){
            var text = '<br><br>※사전신청자가 많은 관계로 원활한 접속 및 시청을 위하여 면허번호 끝자리 숫자에 따른 2부제(홀/짝) 이용을 권유 드립니다.<br><br>'
            text += '예시]<br>'
            text += '면허번호 끝자리 숫자가 짝수 - 짝수 일에 접속(9월 14일, 16일, 18일)<br>면허번호 끝자리 숫자가 홀수 - 홀수 일에 접속(9월 15일, 17일, 19일)<br><br>'
            text += '20일과 21일은 면허번호 끝자리 숫자에 상관없이 시청 가능'
            $('.banner_wrap h2').append(text)
        }
    }

    return {
        init: init,
        sendPhoneNumber: sendPhoneNumber
    };
})();
(function () {
    IndexModule.init();
})();

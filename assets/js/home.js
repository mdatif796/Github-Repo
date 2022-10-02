let loaderContainer = function(){
    return $(`<div id="loader-container">
                <img src="../images/loader.gif" alt="">
            </div>`);
}

let userRepo = function(data, i){
    return $(`<div class="user-repo-${i} user-repo">
                <div class="repo-details">
                    <a href="${data.html_url}" target="_blank"><h2 class="repo-name">${data.name}</h2></a>
                    <p class="repo-desc">${data.description ? data.description : ""}</p>
                </div>
                <div class="lang-btn-container">

                </div>
            </div>`)
}

let userContainer = function(data){
    return $(`<div id="user-details">
                <div id="imgAndName-container">
                    <div id="img-container">
                        <img src=${data.avatar_url} alt="">
                    </div>
                    <div id="name-container">
                        <h1 id="user-name">${data.name}</h1>
                        <p id="user-bio">${data.bio ? data.bio : ""}</p>
                        <p id="user-location">${data.location ? data.location : ""}</p>
                        ${data.twitter_username ? `<p id="twitter-handle">Twitter: <a href="https://twitter.com/${data.twitter_username}">https://twitter.com/${data.twitter_username}</a></p>` : ""} 
                    </div>
                </div>
                <div id="user-github-link">
                    ${data.login ? `<p><a href="https://github.com/${data.login}">https://github.com/${data.login}</a></p>` : ""} 
                </div>
            </div>`);
}


// for handling the pagination page
let prevPage = 1;
let repoLink2;


// click event on button
$('#input-container button').click(function(){
    let userName = $('input').val();
    if(userName === ""){
        alert('Enter username !!');
        return;
    }
    loadDetails(userName);
});

function loadDetails(userName){
    $.ajax({
        url: `https://api.github.com/users/${userName}`,
        method: 'GET',
        beforeSend: function(xhr){
            $('#user-details-container').empty();
            let loader = loaderContainer();
            $('body').append(loader);
        },
        success: function(data1){
            localStorage.setItem('user', JSON.stringify(userName));
            let totalRepo = data1.public_repos;
            let totalPage = Math.round(totalRepo/6);
            let repoLink = `${data1.repos_url}?page=1&per_page=6`;
            repoLink2 = data1.repos_url;
            $.ajax({
                url: repoLink ,
                method: 'GET',
                success: function(data){
                    $('#user-details-container').empty();
                    let container = userContainer(data1);
                    $('#user-details-container').append(container);
                    $('#user-details-container').append($(`<div id="user-repo-container"></div>`));
                    for(let i = 0; i < data.length; i++){
                        $('#user-repo-container').append(userRepo(data[i], i));
                        let languageUrl = data[i].languages_url;
                        $.ajax({
                            url: languageUrl,
                            method: 'GET',
                            success: function(data3){
                                for(language in data3){
                                    $(` .user-repo-${i} .lang-btn-container`).append($(`<button>${language}</button>`));
                                }
                            }
                        });
                    }
                    $('#user-details-container').append(`<div id="pagination"></div>`);
                    for(let i = 1; i <= totalPage; i++){
                        $('#pagination').append(`<p id="${i}">${i}</p>`);
                    }
                    $(`#1`).css('background-color', '#428bca');
                    $(`#1`).css('color', 'white');
                    if($('#pagination')){
                        $('#pagination p').click(function(){
                            let page = $(this).text();
                            $.ajax({
                                url: `${repoLink2}?page=${page}&per_page=6` ,
                                method: 'GET',
                                beforeSend: function(xhr){
                                    $('#user-repo-container').remove();
                                    let loader = loaderContainer();
                                    $('#pagination').before(loader);
                                },
                                success: function(data){
                                    $('#pagination').before($(`<div id="user-repo-container"></div>`));
                                    for(let i = 0; i < data.length; i++){
                                        $('#user-repo-container').append(userRepo(data[i], i));
                                        let languageUrl = data[i].languages_url;
                                        $.ajax({
                                            url: languageUrl,
                                            method: 'GET',
                                            success: function(data3){
                                                for(language in data3){
                                                    $(` .user-repo-${i} .lang-btn-container`).append($(`<button>${language}</button>`));
                                                }
                                            }
                                        });
                                    }
                                    $(`#${prevPage}`).css('background-color', '');
                                    $(`#${prevPage}`).css('color', 'black');
                                    $(`#${page}`).css('background-color', '#428bca');
                                    $(`#${page}`).css('color', 'white');
                                    prevPage = page;
                                },complete: function(xhr){
                                    $('#loader-container').remove();
                                }
                            });
                        });
                    }
                },complete: function(xhr){
                    $('#user-input').val("");
                }
            });
        },complete: function(xhr){
            $('#loader-container').remove();
        }
    }).catch((err) => {
        alert(err.responseJSON.message);
        $('#user-input').val("");
        $('#loader-container').remove();
    });
}


function loadCatchedUser(){
    let userName = JSON.parse(localStorage.getItem('user'));
    console.log(userName);
    loadDetails(userName);
}

// load details when the user comes
loadCatchedUser();




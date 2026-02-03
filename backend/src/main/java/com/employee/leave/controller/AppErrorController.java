package com.employee.leave.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Profile("prod")
public class AppErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        return "forward:/index.html";
    }

}


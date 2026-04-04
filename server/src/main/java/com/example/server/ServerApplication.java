package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@CrossOrigin
	@GetMapping("/")
	public String root() {
		return "Server is running";
	}

	@CrossOrigin
	@GetMapping("/home")
	public String home(){
		return "Hello World";
	}

}

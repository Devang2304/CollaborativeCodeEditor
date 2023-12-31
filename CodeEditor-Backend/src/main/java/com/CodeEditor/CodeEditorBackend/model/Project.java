package com.CodeEditor.CodeEditorBackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


//This is the model/schema of the project
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Project {

    @Id
    private String id;

    private String room;

    private String html;
    private String css;
    private String js;

}

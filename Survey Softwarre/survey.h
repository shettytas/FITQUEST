#ifndef SURVEY_H
#define SURVEY_H

// ------------------------- Structures -------------------------
typedef struct BSTNode {
    char option[50];
    int count;
    struct BSTNode *left, *right;
} BSTNode;

typedef struct Question {
    char text[200];
    char options[5][50];
    int numOptions;
    BSTNode *responses;
    struct Question *next;
} Question;

typedef struct Survey {
    char title[100];
    Question *questions;
} Survey;

typedef struct SurveyNode {
    Survey survey;
    struct SurveyNode *next;
} SurveyNode;

// ------------------------- Function Prototypes -------------------------
BSTNode* createBSTNode(char *option);
BSTNode* insertBST(BSTNode *root, char *option);
int totalResponses(BSTNode *root);
void inorderPrint(BSTNode *root, int total);

Question* newQuestion(char *text, int numOptions);
void addQuestion(Survey *survey);
void conductSurvey(Survey *survey);
void publishResults(Survey *survey);

SurveyNode* createSurveyNode(char *title);
void listSurveys(SurveyNode *head);
SurveyNode* selectSurvey(SurveyNode *head);

#endif

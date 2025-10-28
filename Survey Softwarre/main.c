#include <stdio.h>
#include <string.h>
#include "survey.h"

int main() {
    SurveyNode *surveyList = NULL;
    int ch;
    while (1) {
        printf("\n========= SURVEY SOFTWARE =========\n");
        printf("1. Create new survey\n");
        printf("2. Add questions to a survey\n");
        printf("3. Conduct a survey\n");
        printf("4. Publish survey results\n");
        printf("5. List all surveys\n");
        printf("6. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &ch);

        switch (ch) {
            case 1: {
                char title[100];
                printf("Enter Survey Title: ");
                scanf(" %[^\n]", title);
                SurveyNode *newNode = createSurveyNode(title);
                newNode->next = surveyList;
                surveyList = newNode;
                printf("Survey \"%s\" created successfully!\n", title);
                break;
            }
            case 2: {
                SurveyNode *selected = selectSurvey(surveyList);
                if (selected) addQuestion(&selected->survey);
                break;
            }
            case 3: {
                SurveyNode *selected = selectSurvey(surveyList);
                if (selected) conductSurvey(&selected->survey);
                break;
            }
            case 4: {
                SurveyNode *selected = selectSurvey(surveyList);
                if (selected) publishResults(&selected->survey);
                break;
            }
            case 5:
                listSurveys(surveyList);
                break;
            case 6:
                printf("Exiting program...\n");
                return 0;
            default:
                printf("Invalid choice. Try again.\n");
        }
    }
}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "survey.h"

// ------------------------- BST FUNCTIONS -------------------------
BSTNode* createBSTNode(char *option) {
    BSTNode *node = (BSTNode*)malloc(sizeof(BSTNode));
    strcpy(node->option, option);
    node->count = 1;
    node->left = node->right = NULL;
    return node;
}

BSTNode* insertBST(BSTNode *root, char *option) {
    if (!root) return createBSTNode(option);
    int cmp = strcmp(option, root->option);
    if (cmp == 0)
        root->count++;
    else if (cmp < 0)
        root->left = insertBST(root->left, option);
    else
        root->right = insertBST(root->right, option);
    return root;
}

int totalResponses(BSTNode *root) {
    if (!root) return 0;
    return root->count + totalResponses(root->left) + totalResponses(root->right);
}

void inorderPrint(BSTNode *root, int total) {
    if (!root) return;
    inorderPrint(root->left, total);
    float pct = (root->count * 100.0f) / total;
    printf("%-20s : %2d (%.1f%%) ", root->option, root->count, pct);
    for (int i = 0; i < pct / 5; i++) printf("█");
    printf("\n");
    inorderPrint(root->right, total);
}

// ------------------------- LINKED LIST / SURVEY FUNCTIONS -------------------------
Question* newQuestion(char *text, int numOptions) {
    Question *q = (Question*)malloc(sizeof(Question));
    strcpy(q->text, text);
    q->numOptions = numOptions;
    q->responses = NULL;
    q->next = NULL;
    return q;
}

void addQuestion(Survey *survey) {
    char text[200];
    printf("Enter question text: ");
    scanf(" %[^\n]", text);

    int nopt;
    printf("Enter number of options (max 5): ");
    scanf("%d", &nopt);

    Question *q = newQuestion(text, nopt);
    for (int i = 0; i < nopt; i++) {
        printf("Option %d: ", i + 1);
        scanf(" %[^\n]", q->options[i]);
    }

    if (!survey->questions)
        survey->questions = q;
    else {
        Question *t = survey->questions;
        while (t->next) t = t->next;
        t->next = q;
    }
    printf("Question added successfully!\n");
}

void conductSurvey(Survey *survey) {
    if (!survey->questions) {
        printf("No questions added yet.\n");
        return;
    }
    printf("\n--- Conducting Survey: %s ---\n", survey->title);

    for (Question *q = survey->questions; q; q = q->next) {
        printf("\n%s\n", q->text);
        for (int i = 0; i < q->numOptions; i++)
            printf("%d. %s\n", i + 1, q->options[i]);

        int ch;
        printf("Enter your choice (1-%d): ", q->numOptions);
        scanf("%d", &ch);

        if (ch >= 1 && ch <= q->numOptions)
            q->responses = insertBST(q->responses, q->options[ch - 1]);
        else
            printf("Invalid choice, skipped.\n");
    }

    printf("\nResponses recorded successfully!\n");
}

void publishResults(Survey *survey) {
    if (!survey->questions) {
        printf("No questions to display.\n");
        return;
    }

    printf("\n====== Results for \"%s\" ======\n", survey->title);
    int qno = 1;
    for (Question *q = survey->questions; q; q = q->next, qno++) {
        printf("\nQ%d: %s\n", qno, q->text);
        int total = totalResponses(q->responses);
        if (!total)
            printf("No responses yet.\n");
        else
            inorderPrint(q->responses, total);
    }
    printf("=====================================\n");
}

// ------------------------- MULTIPLE SURVEY FUNCTIONS -------------------------
SurveyNode* createSurveyNode(char *title) {
    SurveyNode *node = (SurveyNode*)malloc(sizeof(SurveyNode));
    strcpy(node->survey.title, title);
    node->survey.questions = NULL;
    node->next = NULL;
    return node;
}

void listSurveys(SurveyNode *head) {
    if (!head) {
        printf("No surveys created yet.\n");
        return;
    }
    int i = 1;
    for (SurveyNode *t = head; t; t = t->next, i++) {
        printf("%d. %s\n", i, t->survey.title);
    }
}

SurveyNode* selectSurvey(SurveyNode *head) {
    if (!head) {
        printf("No surveys available.\n");
        return NULL;
    }
    listSurveys(head);
    printf("Enter survey number to select: ");
    int choice;
    scanf("%d", &choice);
    int i = 1;
    for (SurveyNode *t = head; t; t = t->next, i++) {
        if (i == choice) return t;
    }
    printf("Invalid selection.\n");
    return NULL;
}
